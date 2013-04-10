module enchant {
  export class Event {
    static LOAD: string;
    static PROGRESS: string;
    static ENTER_FRAME: string;
    static EXIT_FRAME: string;
    static ENTER: string;
    static EXIT: string;
    static ADDED: string;
    static ADDED_TO_SCENE: string;
    static REMOVED: string;
    static REMOVED_FROM_SCENE: string;
    static TOUCH_START: string;
    static TOUCH_MOVE: string;
    static TOUCH_END: string;
    static RENDER: string;
    static INPUT_START: string;
    static INPUT_CHANGE: string;
    static INPUT_END: string;
    static LEFT_BUTTON_DOWN: string;
    static LEFT_BUTTON_UP: string;
    static RIGHT_BUTTON_DOWN: string;
    static RIGHT_BUTTON_UP: string;
    static UP_BUTTON_DOWN: string;
    static UP_BUTTON_UP: string;
    static DOWN_BUTTON_DOWN: string;
    static DOWN_BUTTON_UP: string;
    static A_BUTTON_DOWN: string;
    static A_BUTTON_UP: string;
    static B_BUTTON_DOWN: string;
    static B_BUTTON_UP: string;
  }
  export class EventTarget {
    addEventListener(type: string, listener: Function);
    removeEventListener(type: string, listener: Function);
    clearEventListener(type: string);
    dispatchEvent(e: any);
    on(type: string, listener: Function);
    onload:Function;
  }
  export class Core extends EventTarget {
    input: any;
    fps: number;
    rootScene: Scene;
    assets: Scene;
    actualFps:number;
    constructor ();
    //start and stop
    start(): void;
    stop(): void;
    pause(): void;
    debug(): void;
    resume(): void;
    getElapsedTime():number;

    // loading
    load(src: string, callback?: Function): void;
    preload(Array): void;
    findExt(path: string): string;

    //scene
    pushScene(scene: Scene);
    popScene(scene: Scene);
    replaceScene(scene: Scene);
    removeScene(scene: Scene);
    keybind(key:string, buttons:string);
  }
  export class Node extends EventTarget {
    x: number;
    y: number;
    moveTo(x:number, y:number):void;
    moveBy(x:number, y:number):void;
    remove();
  }

  export class Entity extends Node {
    id: string;
    className: string;
    width: number;
    height: number;
    backgroundColor: string;
    opacity: number;
    visible: bool;
    touchEnabled: bool;
    scaleX: number;
    scaleY: number;
    intersect(other:Entity): bool;
    within(other:Entity, distance: number): bool;
    scale(x:number, y:number): void;
    rotate(degree: number): void;
  }

  export class Sprite extends Entity {
    image: any;
    frame: number;
    constructor(w: number, h: number);
  }
  export class Label extends Entity {
    text: string;
    textAlign: string;
    font: string;
    color: string;
  }
  export class Map extends Entity {
    image: any;
    tileWidth: number;
    width: number;
    height: number;
    loadData(data: any);
    checkTile(x:number, y: number);
    hitTest(x:number, y: number);
    redraw(x: number, y:number, width: number, height: number);
  };

  export class Group extends Node {
    firstChild: Node;
    lastChild: Node;
    addChild(node: Node): void;
    removeChild(node: Node): void;
    insertBefore(node: Node, reference): void;
  }
  export class RGroup extends Group {
    rotation:number;
  }

  export class Scene extends Group {
    backgroundColor: string;
  }

  export class CanvasGroup extends Group {
    rotation:number;
  }
  export class Surface extends EventTarget {
    static load(src: string);
    getPixel(x: number, y: number);
    setPixel(x: number, y: number);
    clear();
    draw(image);
    clone();
    toDataURL();
  }
  export class Sound extends EventTarget {
    static load(src: string);
    play();
    pause();
    stop();
    clone();
    currentTime: number;
    volume: number;
    static load(src: string, type?: string);
  }
}
