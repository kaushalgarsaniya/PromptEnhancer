# Database Schema Specification — PromptForge

Database: **Supabase PostgreSQL**

## Entity Relationship & Table Definitions

### 1. `profiles`
Extends `auth.users` with user details.
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
```

### 2. `prompts`
Core prompt storage table.
```sql
CREATE TABLE public.prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NULLABLE, -- Nullable for anonymous session sync
    title TEXT NOT NULL,
    original_prompt TEXT NOT NULL,
    detected_language VARCHAR(10) NOT NULL,
    confidence FLOAT DEFAULT 1.0,
    intent VARCHAR(50) NOT NULL,
    target_model VARCHAR(50) NOT NULL,
    optimized_prompt TEXT NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX idx_prompts_created_at ON public.prompts(created_at DESC);
CREATE INDEX idx_prompts_intent ON public.prompts(intent);

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own prompts" ON public.prompts
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
```

### 3. `prompt_versions`
Stores version presets (Basic, Detailed, Expert, AI Agent Ready) for a given prompt.
```sql
CREATE TABLE public.prompt_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
    version_name VARCHAR(50) NOT NULL, -- 'Basic', 'Detailed', 'Expert', 'AI Agent Ready'
    content TEXT NOT NULL,
    score INT NOT NULL DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_prompt_versions_prompt_id ON public.prompt_versions(prompt_id);
```

### 4. `prompt_analysis`
Detailed heuristic scores and sub-breakdowns.
```sql
CREATE TABLE public.prompt_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
    clarity_score INT NOT NULL,
    context_score INT NOT NULL,
    specificity_score INT NOT NULL,
    completeness_score INT NOT NULL,
    constraint_score INT NOT NULL,
    output_format_score INT NOT NULL,
    improvements JSONB DEFAULT '[]'::jsonb,
    analysis_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_prompt_analysis_prompt_id ON public.prompt_analysis(prompt_id);
```

### 5. `templates`
Prebuilt prompt templates for various domains.
```sql
CREATE TABLE public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Development', 'Design', 'Education', 'Business', 'AI'
    description TEXT NOT NULL,
    template_content TEXT NOT NULL,
    starter_prompt TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_templates_category ON public.templates(category);
```

### 6. `favorites`
Stores user-bookmarked prompts.
```sql
CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, prompt_id)
);
```

### 7. `usage_events`
Rate-limiting and analytics tracking events.
```sql
CREATE TABLE public.usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ip_hash TEXT,
    event_type VARCHAR(50) NOT NULL, -- 'prompt_optimized', 'template_copied', 'export'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_usage_events_user_type ON public.usage_events(user_id, event_type);
```
