import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Obter os cookies da requisição
  const userCookie = request.cookies.get('user');
  const tokenCookie = request.cookies.get('token');

  // Verificar se a rota atual deve ser protegida
  const { pathname } = request.nextUrl;

  // Rotas públicas do admin que não precisam de autenticação
  const publicAdminRoutes = ['/admin/login', '/admin/cadastro'];
  const isPublicAdminRoute = publicAdminRoutes.includes(pathname);

  // Verificar se é uma rota protegida
  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/user');

  // Uma rota admin é protegida se não for uma rota pública
  const isProtectedAdminRoute = isAdminRoute && !isPublicAdminRoute;

  // Rota protegida: todas as rotas /user ou rotas /admin exceto as públicas
  const isProtectedRoute = isUserRoute || isProtectedAdminRoute;

  // Se for uma rota protegida e não tiver os cookies necessários, redirecionar para o login
  if (isProtectedRoute && (!userCookie || !tokenCookie)) {
    // Determinar para qual página de login redirecionar
    let loginUrl;

    if (isAdminRoute) {
      // Redirecionar para a página de login de admin
      loginUrl = new URL('/admin/login', request.url);
    } else {
      // Redirecionar para a página de login de usuário
      loginUrl = new URL('/login', request.url);
    }

    // Redirecionar para a página de login apropriada
    return NextResponse.redirect(loginUrl);
  }

  // Se não for uma rota protegida ou tiver os cookies necessários, permitir o acesso
  return NextResponse.next();
}

// Configurar em quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    // Rotas protegidas
    '/user/:path*',
    '/admin/:path*',
    // Adicione outras rotas protegidas aqui se necessário
  ],
};
