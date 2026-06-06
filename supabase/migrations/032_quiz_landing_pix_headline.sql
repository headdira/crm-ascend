-- Landing do quiz: headline estilo sócio + PIX semanal (gatilho de conversão)
UPDATE form_definitions
SET schema = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          schema::jsonb,
          '{landing,eyebrow}',
          '"Vagas abertas · diagnóstico gratuito"'
        ),
        '{landing,headline}',
        '"Descubra como ser **sócio de uma loja online** no Ascend Club e receber **PIX semanais** de [[R$ 2.554,00]]"'
      ),
      '{landing,subheadline}',
      '"Loja pronta, produtos selecionados e mentoria ao vivo — mesmo começando do zero, sem precisar aparecer e sem investir em anúncios."'
    ),
    '{landing,ctaLabel}',
    '"QUERO VER MEU PLANO"'
  ),
  '{landing,socialProof}',
  '"+847 alunos já ativaram loja e recebendo vendas toda semana"'
)
WHERE slug = 'ascend-ads';
