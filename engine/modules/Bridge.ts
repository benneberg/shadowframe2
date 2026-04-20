export class Bridge {
  static init() {
    (window as any).SignagePlayer = (window as any).SignagePlayer || {
      onMediaChange: (data: any) => {
        console.log('[Bridge] Media Change:', data);
      }
    };
  }
}
