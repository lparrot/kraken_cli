import {MenuItem, MenuParent} from '@socle/ui';

export default async function configPlugin(ctx) {
  const adminPrefix = ctx.$config.get('admin.prefix')
  const adminPages = ctx.$config.get('admin.pages')

  ctx.$app.defineConfiguration({
    layout: {
      title: '<%= name %>',
      description: '<% if (locals.description) { %><%= description %><% } %>',
      menu: [
        new MenuItem({label: 'Accueil', url: '/'}),
        new MenuParent({
          label: 'Référentiels', children: [
            new MenuItem({label: 'Utilisateurs', url: '/referentiels/utilisateurs', access: ['ADMIN']}),
          ]
        }),
        new MenuParent({
          label: 'Administration', children: adminPages.map(page => new MenuItem({url: `${adminPrefix}/${page.path}`, label: page.label})),
        })
      ]
    },
    admin: {
      access: {
        all: ['ADMIN'],
      }
    }
  })
}
