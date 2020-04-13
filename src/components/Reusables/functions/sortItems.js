export default (a, b) => {
    if (a.order && b.order && a.order !== b.order) return a.order - b.order;
    if (a.order && !b.order) return a.order;
    if (!a.order && b.order) return -1 * b.order;
    if (a.createdAt && b.createdAt) return b.createdAt.seconds - a.createdAt.seconds;
    if (!a.createdAt) return -1
    if (!b.createdAt) return 1
    return 0
}