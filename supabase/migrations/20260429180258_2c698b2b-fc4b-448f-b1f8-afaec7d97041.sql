-- App role enum + user_roles table (separate, secure)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Guests / RSVP
CREATE TABLE public.convidados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT,
  num_acompanhantes INTEGER NOT NULL DEFAULT 0 CHECK (num_acompanhantes >= 0 AND num_acompanhantes <= 10),
  acompanhantes JSONB NOT NULL DEFAULT '[]'::jsonb,
  presenca_confirmada BOOLEAN NOT NULL DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.convidados ENABLE ROW LEVEL SECURITY;

-- Anyone (public invite) can confirm presence
CREATE POLICY "Public can RSVP" ON public.convidados
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(nome) > 0 
    AND char_length(nome) <= 100
    AND num_acompanhantes >= 0 
    AND num_acompanhantes <= 10
  );

-- Only admins can see the full guest list
CREATE POLICY "Admins view guests" ON public.convidados
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update guests" ON public.convidados
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete guests" ON public.convidados
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Message wall
CREATE TABLE public.mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads messages" ON public.mensagens
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Public writes messages" ON public.mensagens
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(nome) > 0 AND char_length(nome) <= 80
    AND char_length(mensagem) > 0 AND char_length(mensagem) <= 500
  );

CREATE POLICY "Admins delete messages" ON public.mensagens
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Realtime for message wall
ALTER PUBLICATION supabase_realtime ADD TABLE public.mensagens;