declare interface Navigator {
  clipboard: {
    readText(): Promise<string>;
    writeText(text: string): Promise<string>;
  };
}
declare var idb: any;
