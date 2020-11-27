// 0 普通模式，同步渲染，React15-16的生产环境用，
export const NoMode = 0b0000;
// 1 严格模式，用来检测是否存在废弃API，React16-17开发环境使用，
export const StrictMode = 0b0001; 
// TODO: Remove BatchedMode and ConcurrentMode by reading from the root
// tag instead
export const BatchedMode = 0b0010;
// 4 并发模式，异步渲染，React17的生产环境用，
export const ConcurrentMode = 0b0100;
// 8 性能测试模式，用来检测哪里存在性能问题，React16-17开发环境使
export const ProfileMode = 0b1000;