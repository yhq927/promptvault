-- =====================================================
-- PromptVault Seed Data
-- Sample data for development and testing
-- =====================================================

-- Note: Run this after schema.sql and auth.sql
-- The user_id will need to be replaced with actual auth.users ids

-- Sample Categories
INSERT INTO public.categories (name, slug, description) VALUES
    ('写作', 'writing', '写作辅助提示词'),
    ('编程', 'coding', '编程和代码生成提示词'),
    ('营销', 'marketing', '营销和文案提示词'),
    ('教育', 'education', '教育学习相关提示词'),
    ('创意', 'creative', '创意和艺术相关提示词')
ON CONFLICT (slug) DO NOTHING;

-- Sample Tags
INSERT INTO public.tags (name, slug) VALUES
    ('GPT-4', 'gpt4'),
    ('Claude', 'claude'),
    ('Midjourney', 'midjourney'),
    ('Stable Diffusion', 'stable-diffusion'),
    ('通用', 'general'),
    ('英文', 'english'),
    ('中文', 'chinese')
ON CONFLICT (slug) DO NOTHING;

-- Sample Prompts (uncomment and add user_id after user creation)
-- INSERT INTO public.prompts (user_id, category_id, title, content, description, is_public) VALUES
--     (NULL, (SELECT id FROM categories WHERE slug = 'writing'), '文章续写助手', '请根据以下内容继续写作，保持风格一致...', '帮助用户续写文章', true),
--     (NULL, (SELECT id FROM categories WHERE slug = 'coding'), '代码审查助手', '请审查以下代码并提供改进建议...', '代码审查和优化建议', true);
