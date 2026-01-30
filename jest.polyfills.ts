import { TextDecoder, TextEncoder } from "util";

// @ts-expect-error - JSDOM doesn't define these globals in Node 18.
global.TextEncoder = TextEncoder;
// @ts-expect-error - JSDOM doesn't define these globals in Node 18.
global.TextDecoder = TextDecoder;
