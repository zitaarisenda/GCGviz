
-- Membuat tabel profiles untuk data pengguna tambahan
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Admin Divisi', 'User')),
  divisi TEXT CHECK (
    (role = 'Admin Divisi' AND divisi IS NOT NULL) OR 
    (role = 'User' AND divisi IS NULL)
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membuat tabel dokumen untuk metadata dokumen
CREATE TABLE public.dokumen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  judul_dokumen TEXT NOT NULL,
  jenis_dokumen TEXT NOT NULL,
  prinsip_gcg TEXT NOT NULL,
  divisi_terkait TEXT NOT NULL,
  tahun_dokumen INTEGER NOT NULL,
  deskripsi TEXT,
  file_url TEXT,
  uploader_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Membuat bucket untuk storage dokumen
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dokumen-gcg', 'dokumen-gcg', true);

-- Enable RLS pada tabel profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy untuk profiles: users dapat melihat dan mengupdate profile mereka sendiri
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Enable RLS pada tabel dokumen
ALTER TABLE public.dokumen ENABLE ROW LEVEL SECURITY;

-- Policy untuk dokumen: Admin Divisi hanya bisa melihat dokumen dari divisinya
CREATE POLICY "Admin Divisi can view own division documents" ON public.dokumen
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Admin Divisi' 
      AND profiles.divisi = dokumen.divisi_terkait
    )
  );

-- Policy untuk dokumen: User dapat melihat semua dokumen
CREATE POLICY "Users can view all documents" ON public.dokumen
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'User'
    )
  );

-- Policy untuk dokumen: Admin Divisi dapat insert dokumen untuk divisinya
CREATE POLICY "Admin Divisi can insert documents for their division" ON public.dokumen
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Admin Divisi' 
      AND profiles.divisi = dokumen.divisi_terkait
    ) AND uploader_id = auth.uid()
  );

-- Policy untuk dokumen: Admin Divisi dapat update dokumen dari divisinya
CREATE POLICY "Admin Divisi can update own division documents" ON public.dokumen
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Admin Divisi' 
      AND profiles.divisi = dokumen.divisi_terkait
    ) AND uploader_id = auth.uid()
  );

-- Policy untuk dokumen: Admin Divisi dapat delete dokumen dari divisinya
CREATE POLICY "Admin Divisi can delete own division documents" ON public.dokumen
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Admin Divisi' 
      AND profiles.divisi = dokumen.divisi_terkait
    ) AND uploader_id = auth.uid()
  );

-- Storage policies untuk bucket dokumen-gcg
CREATE POLICY "Authenticated users can view documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'dokumen-gcg' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Divisi can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'dokumen-gcg' AND 
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Admin Divisi'
    )
  );

-- Function untuk handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Profile akan dibuat manual dari aplikasi, jadi tidak perlu trigger otomatis
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
