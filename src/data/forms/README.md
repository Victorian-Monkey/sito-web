# Dynamic Form Widget

Un widget di form dinamico per i 3 form essenziali del Victorian Monkey: Contatti, Login e Registrazione.

## Form Disponibili

- ✅ **Form Contatti** - Nome, email, telefono, messaggio
- ✅ **Form Login** - Email e password
- ✅ **Form Registrazione** - Nome, cognome, email, telefono, sesso assegnato alla nascita, nome di elezione

## Caratteristiche

- ✅ **Configurazione JSON semplice**
- ✅ **Validazione client-side avanzata**
- ✅ **Validazione telefono internazionale** (libphonenumber-js)
- ✅ **Validazione codice fiscale italiano**
- ✅ **Validazione incrociata campi**
- ✅ **Design responsive**
- ✅ **Integrazione API**

## Tipi di Campo Supportati

### Input Standard
- `text` - Testo semplice
- `email` - Indirizzo email
- `tel` - Numero di telefono
- `password` - Password
- `number` - Numero
- `date` - Data
- `datetime-local` - Data e ora
- `time` - Ora
- `url` - URL
- `search` - Ricerca
- `hidden` - Campo nascosto

### Input Speciali
- `textarea` - Area di testo
- `select` - Menu a tendina
- `radio` - Pulsanti radio
- `checkbox` - Caselle di spunta
- `file` - Upload file

## Configurazione JSON

### Struttura Base

```json
{
  "fields": [
    {
      "type": "text",
      "name": "firstName",
      "label": "Nome",
      "placeholder": "Inserisci il tuo nome",
      "required": true,
      "validation": {
        "required": true,
        "minLength": 2
      }
    }
  ],
  "submitButton": {
    "text": "Invia",
    "variant": "primary"
  },
  "successMessage": "Form inviato con successo!",
  "apiEndpoint": "/api/endpoint"
}
```

### Configurazione Campi

#### Proprietà Base
- `type` - Tipo di campo (opzionale, default: 'text')
- `name` - Nome del campo (obbligatorio)
- `label` - Etichetta del campo
- `placeholder` - Testo placeholder
- `required` - Campo obbligatorio
- `helpText` - Testo di aiuto
- `classes` - Classi CSS personalizzate
- `columnClass` - Classi per layout a colonne

#### Proprietà Specifiche per Tipo
- `rows` - Numero di righe (textarea)
- `options` - Opzioni per select/radio/checkbox
- `accept` - Tipi di file accettati (file)
- `multiple` - Upload multipli (file)
- `min/max` - Valori minimi/massimi (number/date)
- `step` - Incremento (number)
- `pattern` - Pattern regex

#### Validazione
```json
{
  "validation": {
    "required": true,
    "requiredMessage": "Campo obbligatorio",
    "email": true,
    "emailMessage": "Email non valida",
    "phone": true,
    "phoneMessage": "Telefono non valido",
    "minLength": 3,
    "minLengthMessage": "Minimo 3 caratteri",
    "maxLength": 100,
    "maxLengthMessage": "Massimo 100 caratteri",
    "pattern": "^[a-zA-Z]+$",
    "patternMessage": "Solo lettere",
    "custom": "functionName"
  }
}
```

### Configurazione Submit Button
```json
{
  "submitButton": {
    "text": "Invia Messaggio",
    "variant": "primary",
    "classes": "w-full"
  }
}
```

### Configurazione Messaggi
```json
{
  "successMessage": "Grazie! Messaggio inviato.",
  "errorMessage": "Errore durante l'invio.",
  "description": "Compila il form qui sotto"
}
```

### Configurazione Disclaimer
```json
{
  "disclaimer": {
    "text": "Accetto i termini e condizioni"
  }
}
```

### Configurazione API
```json
{
  "api": {
    "url": "https://api.example.com/endpoint",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer your-token",
      "X-Custom-Header": "value"
    },
    "timeout": 10000
  }
}
```

#### Opzioni API
- `url` - URL dell'endpoint API (obbligatorio)
- `method` - Metodo HTTP: GET, POST, PUT, PATCH, DELETE (default: POST)
- `headers` - Headers HTTP personalizzati
- `timeout` - Timeout in millisecondi (opzionale)

#### Supporto Legacy
```json
{
  "apiEndpoint": "/api/endpoint"
}
```

## Utilizzo

### 1. Import del Componente
```astro
---
import DynamicForm from '~/components/widgets/DynamicForm.astro';
import formConfig from '~/data/forms/my-form.json';
---
```

### 2. Utilizzo Base
```astro
<DynamicForm
  title="Titolo del Form"
  subtitle="Sottotitolo"
  formConfig={formConfig}
/>
```

### 3. Configurazione Inline
```astro
<DynamicForm
  title="Form Inline"
  formConfig={{
    fields: [
      {
        type: "text",
        name: "name",
        label: "Nome",
        required: true
      }
    ],
    submitButton: {
      text: "Invia"
    }
  }}
/>
```

## Validazione Personalizzata

### Funzione JavaScript
```javascript
window.validatePasswordMatch = function(value) {
  const passwordField = document.querySelector('input[name="password"]');
  if (passwordField && value !== passwordField.value) {
    return "Le password non coincidono";
  }
  return true;
};
```

### Utilizzo nel JSON
```json
{
  "validation": {
    "custom": "validatePasswordMatch"
  }
}
```

## API Integration

### Endpoint API
Il form può inviare i dati a un endpoint API specificato:

```json
{
  "apiEndpoint": "/api/contact"
}
```

### Gestione Risposta
```javascript
// Callback di successo
{
  "onSuccess": "function(data) { console.log('Success!', data); }"
}
```

## Form Configurati

### 1. Form Contatti (`contact-form.json`)
```json
{
  "fields": [
    {
      "type": "text",
      "name": "name",
      "label": "Nome",
      "required": true
    },
    {
      "type": "email", 
      "name": "email",
      "label": "Email",
      "required": true
    },
    {
      "type": "tel",
      "name": "phone", 
      "label": "Telefono",
      "required": true
    },
    {
      "type": "textarea",
      "name": "message",
      "label": "Messaggio",
      "required": true
    }
  ],
  "api": {
    "url": "/api/contatti",
    "method": "POST"
  }
}
```

### 2. Form Login (`login-form.json`)
```json
{
  "fields": [
    {
      "type": "email",
      "name": "email",
      "label": "Email",
      "required": true
    },
    {
      "type": "password",
      "name": "password", 
      "label": "Password",
      "required": true
    }
  ],
  "api": {
    "url": "/api/login",
    "method": "POST"
  }
}
```

### 3. Form Registrazione (`registration-form.json`)
```json
{
  "fields": [
    {
      "type": "text",
      "name": "nome",
      "label": "Nome",
      "required": true
    },
    {
      "type": "text",
      "name": "cognome",
      "label": "Cognome", 
      "required": true
    },
    {
      "type": "email",
      "name": "email",
      "label": "Email",
      "required": true
    },
    {
      "type": "tel",
      "name": "telefono",
      "label": "Numero di telefono",
      "required": true
    },
    {
      "type": "radio",
      "name": "sesso_assegnato",
      "label": "Sesso assegnato alla nascita",
      "required": true,
      "options": [
        { "value": "maschio", "label": "Maschio" },
        { "value": "femmina", "label": "Femmina" },
        { "value": "altro", "label": "Altro" }
      ]
    },
    {
      "type": "text",
      "name": "nome_elezione",
      "label": "Nome di elezione (opzionale)"
    },
    {
      "type": "text",
      "name": "codice_fiscale",
      "label": "Codice Fiscale (opzionale)",
      "placeholder": "RSSMRA80A01H501U"
    },
    {
      "type": "checkbox",
      "name": "no_codice_fiscale",
      "label": "Dichiarazione di responsabilità",
      "options": [
        { 
          "value": "true", 
          "label": "Dichiaro di non essere residente in Italia..." 
        }
      ]
    }
  ],
  "api": {
    "url": "/api/registrazione",
    "method": "POST"
  }
}
```

## Styling

Il componente utilizza Tailwind CSS e può essere personalizzato tramite:

1. **Classi sui campi**: `classes` property
2. **Layout a colonne**: `columnClass` property
3. **Classi container**: `classes.container` property
4. **Classi submit button**: `submitButton.classes` property

## Accessibilità

- Labels associati correttamente
- Supporto per screen reader
- Navigazione da tastiera
- Messaggi di errore accessibili
- Focus management

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Note di Sviluppo

- I file JSON devono essere validi
- Le funzioni di validazione personalizzate devono essere globali
- L'endpoint API deve restituire JSON
- I file upload sono gestiti automaticamente
