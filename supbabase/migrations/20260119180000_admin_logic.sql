-- Create functions for admin actions
CREATE OR REPLACE FUNCTION public.aprovar_profissional(target_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  v_admin_id := auth.uid();
  
  -- Check if executor is admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;

  UPDATE public.profiles
  SET status = 'ativo', is_visible = true
  WHERE id = target_id;

  INSERT INTO public.admin_logs (admin_id, target_id, action, details)
  VALUES (v_admin_id, target_id, 'approve', '{"status": "ativo"}'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.reprovar_profissional(target_id UUID, motivo TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  v_admin_id := auth.uid();
  
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;

  UPDATE public.profiles
  SET status = 'reprovado', is_visible = false
  WHERE id = target_id;

  INSERT INTO public.admin_logs (admin_id, target_id, action, details)
  VALUES (v_admin_id, target_id, 'reject', jsonb_build_object('reason', motivo));
END;
$$;

CREATE OR REPLACE FUNCTION public.bloquear_usuario(target_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  v_admin_id := auth.uid();
  
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;

  UPDATE public.profiles
  SET status = 'bloqueado', is_visible = false
  WHERE id = target_id;

  INSERT INTO public.admin_logs (admin_id, target_id, action, details)
  VALUES (v_admin_id, target_id, 'block', '{"status": "bloqueado"}'::jsonb);
END;
$$;
