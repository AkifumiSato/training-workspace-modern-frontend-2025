export type AccessibilityTreeResponse = {
  nodes: AXNode[];
};

// `client.send` の戻り値の型を定義
// Playwightが提供する型から導出は難しかったため、自前で定義
export type AXNode = {
  nodeId: string;
  ignored: boolean;
  ignoredReasons?: Array<{
    name: string;
    value?: string;
  }>;
  role?: {
    type: string;
    value: string;
  };
  chromeRole?: {
    type: string;
    value: string;
  };
  name?: {
    type: string;
    value: string;
    sources?: Array<{
      type: string;
      value?: string;
      attribute?: string;
      attributeValue?: string;
      superseded?: boolean;
      nativeSource?: string;
      nativeSourceValue?: string;
      invalid?: boolean;
      invalidReason?: string;
    }>;
  };
  description?: {
    type: string;
    value: string;
    sources?: Array<{
      type: string;
      value?: string;
      attribute?: string;
      attributeValue?: string;
      superseded?: boolean;
      nativeSource?: string;
      nativeSourceValue?: string;
      invalid?: boolean;
      invalidReason?: string;
    }>;
  };
  value?: {
    type: string;
    value: string;
  };
  properties?: Array<{
    name: string;
    value: {
      type: string;
      value: string;
    };
  }>;
  parentId?: string;
  childIds?: string[];
  backendDOMNodeId?: number;
  frameId?: string;
};

export type A11yNode = {
  role?: string;
  name?: string;
  value?: string;
  description?: string;
  children?: A11yNode[];
  [key: string]: unknown;
};
