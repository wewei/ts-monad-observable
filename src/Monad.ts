import { Observable, observable } from "./Observable";

export const bind =
  <S, T>(f: (src: S) => Observable<T>) =>
  (obSrc: Observable<S>): Observable<T> =>
    observable((update) => {
      let unobserveTar = () => {};
      const setSrc = (src: S) => {
        const obnTar = f(src).observe((tar) => update(() => tar));
        unobserveTar();
        unobserveTar = obnTar.unobserve;
        return obnTar.value;
      };
      const obnSrc = obSrc.observe((src) => update(() => setSrc(src)));
      const value = setSrc(obnSrc.value);
      return {
        value,
        unobserve: () => {
          unobserveTar();
          obnSrc.unobserve();
        },
      };
    });
