import { Hono } from '@hono/hono';
import { serveStatic } from '@hono/hono/deno';

const app = new Hono();

// Serve static files
app.use('/src/*', serveStatic({ root: './' }));
app.use('/node_modules/*', serveStatic({ root: './' }));

// Serve the main HTML with React setup
app.get('/', (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recipe Organizer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18.3.1",
      "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
      "react-error-boundary": "https://esm.sh/react-error-boundary@4.1.2",
      "@phosphor-icons/react": "https://esm.sh/@phosphor-icons/react@2.1.10",
      "@radix-ui/react-dialog": "https://esm.sh/@radix-ui/react-dialog@1.1.14",
      "@radix-ui/react-select": "https://esm.sh/@radix-ui/react-select@2.2.5",
      "@radix-ui/react-label": "https://esm.sh/@radix-ui/react-label@2.1.7",
      "@radix-ui/react-alert-dialog": "https://esm.sh/@radix-ui/react-alert-dialog@1.1.14",
      "class-variance-authority": "https://esm.sh/class-variance-authority@0.7.1",
      "clsx": "https://esm.sh/clsx@2.1.1",
      "tailwind-merge": "https://esm.sh/tailwind-merge@2.6.0",
      "sonner": "https://esm.sh/sonner@1.7.4"
    }
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { ErrorBoundary } from 'react-error-boundary';
    
    // Simple error fallback
    function ErrorFallback({error}) {
      return React.createElement('div', {
        style: { padding: '20px', textAlign: 'center' }
      }, [
        React.createElement('h2', { key: 'title' }, 'Something went wrong'),
        React.createElement('p', { key: 'error' }, error.message),
        React.createElement('button', { 
          key: 'reload',
          onClick: () => window.location.reload(),
          style: { marginTop: '10px', padding: '8px 16px' }
        }, 'Reload page')
      ]);
    }
    
    // Simple loading component
    function Loading() {
      return React.createElement('div', {
        style: { 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column'
        }
      }, [
        React.createElement('div', { 
          key: 'spinner',
          style: { 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }
        }),
        React.createElement('p', { key: 'text', style: { marginTop: '20px' } }, 'Loading Recipe Organizer...')
      ]);
    }
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    \`;
    document.head.appendChild(style);
    
    // Show loading initially
    const root = createRoot(document.getElementById('root'));
    root.render(React.createElement(Loading));
    
    // Test API connection
    async function testConnection() {
      try {
        const response = await fetch('http://localhost:3001/api/recipes');
        if (response.ok) {
          // API is working, show success message
          root.render(React.createElement('div', {
            style: { 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              flexDirection: 'column'
            }
          }, [
            React.createElement('h1', { key: 'title', style: { fontSize: '2rem', marginBottom: '20px' } }, '🍳 Recipe Organizer'),
            React.createElement('p', { key: 'status', style: { color: 'green', marginBottom: '20px' } }, '✅ Connected to database!'),
            React.createElement('p', { key: 'recipes' }, \`Found \${(await response.json()).length} recipes\`),
            React.createElement('p', { key: 'note', style: { marginTop: '20px', color: '#666' } }, 'Full app loading will be implemented next...')
          ]));
        } else {
          throw new Error('API not responding');
        }
      } catch (error) {
        root.render(React.createElement('div', {
          style: { 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column'
          }
        }, [
          React.createElement('h1', { key: 'title', style: { fontSize: '2rem', marginBottom: '20px' } }, '🍳 Recipe Organizer'),
          React.createElement('p', { key: 'error', style: { color: 'red', marginBottom: '20px' } }, '❌ Cannot connect to API server'),
          React.createElement('p', { key: 'instruction' }, 'Make sure the API server is running on port 3001'),
          React.createElement('button', { 
            key: 'retry',
            onClick: testConnection,
            style: { marginTop: '20px', padding: '8px 16px' }
          }, 'Retry Connection')
        ]));
      }
    }
    
    // Test connection after a short delay
    setTimeout(testConnection, 1000);
  </script>
</body>
</html>`;
  
  return c.html(html);
});

// Handle all routes for SPA
app.get('/*', (c) => {
  return c.redirect('/');
});

const port = parseInt(Deno.env.get('FRONTEND_PORT') || '5173');

console.log(`🌐 Frontend server running at http://localhost:${port}`);
console.log(`🔗 Connect to API at http://localhost:3001`);

Deno.serve({ port }, app.fetch);