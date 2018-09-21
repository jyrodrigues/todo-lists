function binder(self: React.Component<any, any>) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(self))
    .filter(name => name && name !== 'constructor' && name !== 'render')
    .forEach(method => self[method] = self[method].bind(self));
}

export default binder;