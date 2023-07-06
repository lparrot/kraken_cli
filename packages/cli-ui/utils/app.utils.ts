export function getAllAssociations() {
  return [
    {id: 'ONE_TO_ONE', name: 'Relation 1:1', assoc_name: 'OneToOne', icon: 'mdi-relation-one-to-one', iconClass: ''},
    {id: 'ONE_TO_MANY', name: 'Relation 1:n', assoc_name: 'OneToMany', icon: 'mdi-relation-one-to-many', iconClass: ''},
    {id: 'MANY_TO_ONE', name: 'Relation n:1', assoc_name: 'ManyToOne', icon: 'mdi-relation-many-to-one', iconClass: ''},
    {id: 'MANY_TO_MANY', name: 'Relation n:n', assoc_name: 'ManyToMany', icon: 'mdi-relation-many-to-many', iconClass: ''},
    {id: 'EMBEDDED', name: 'Entité embarquée', assoc_name: 'Embedded', icon: 'mdi-axis-y-arrow', iconClass: ''},
    {id: 'ELEMENT_COLLECTION', name: `Collection d'éléments`, assoc_name: 'ElementCollection', icon: 'segment', iconClass: ''},
  ]
}

export function getPersistentTypeData(associationType: string) {
  const associations = getAllAssociations().filter(assoc => assoc.id === associationType)
  if (associations.length === 0) {
    return null
  }
  return associations[0]
}
