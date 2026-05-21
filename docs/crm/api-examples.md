# CRM Builder API — exemplos curl

Base: `https://your-app.vercel.app` (ou `http://localhost:3000`)

```bash
export BASE_URL=http://localhost:3000
export BUILDER_KEY=your-builder-key
```

## validate-student

```bash
curl -s -X POST "$BASE_URL/api/crm/validate-student" \
  -H "Content-Type: application/json" \
  -H "X-Builder-Key: $BUILDER_KEY" \
  -d '{"email":"aluno@email.com"}'
```

## validate-eligibility

```bash
curl -s -X POST "$BASE_URL/api/crm/validate-eligibility" \
  -H "Content-Type: application/json" \
  -H "X-Builder-Key: $BUILDER_KEY" \
  -d '{"student_id":"<uuid>","product_sku":"MENT-1:1"}'
```

## form-submit

```bash
curl -s -X POST "$BASE_URL/api/crm/form-submit" \
  -H "Content-Type: application/json" \
  -H "X-Builder-Key: $BUILDER_KEY" \
  -d '{
    "form_slug": "mentoria-interesse",
    "identifier": { "email": "aluno@email.com" },
    "fields": { "mensagem": "Quero mentoria" },
    "open_case": true,
    "service_code": "COMERCIAL"
  }'
```
