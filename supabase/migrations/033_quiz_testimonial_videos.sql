-- Depoimentos em vídeo + prints locais no resultado do quiz
UPDATE form_definitions
SET schema = jsonb_set(
  schema::jsonb,
  '{testimonials}',
  '[
    {
      "name": "Izabela",
      "role": "Aluno Ascend Club",
      "quote": "Nunca vendi online antes. Hoje recebo PIX toda semana com a loja que me entregaram pronta.",
      "videoUrl": "/media/quiz-evidence/videos/06-video-izabela.mp4"
    },
    {
      "name": "Renata",
      "role": "Aluno Ascend Club",
      "quote": "A mentoria ao vivo com o Erick destrava na hora — não é curso gravado que você abandona.",
      "videoUrl": "/media/quiz-evidence/videos/10-video-renata-mensão-erick.mp4"
    },
    {
      "name": "Eros",
      "role": "10 vendas no programa",
      "quote": "Bati 10 vendas seguindo o passo a passo. Loja pronta, produtos bons, só aprendi a divulgar.",
      "videoUrl": "/media/quiz-evidence/videos/01-eros-10-vendas.mp4"
    }
  ]'::jsonb
)
WHERE slug = 'ascend-ads';
