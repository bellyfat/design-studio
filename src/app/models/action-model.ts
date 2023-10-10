import { v4 as uuidv4 } from 'uuid';
import { TYPE_ACTION, TYPE_ATTACHMENT, TYPE_COMMAND, TYPE_MATH_OPERATOR, TYPE_METHOD_REQUEST, TYPE_OPERATOR } from '../chatbot-design-studio/utils';

export class Action {
    _tdActionType: string;
    _tdActionTitle: string = '';
    _tdActionId: any = uuidv4();
}

export class ActionAssignVariable extends Action {
    destination: string;
    operation: Operation;
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.ASSIGN_VARIABLE;
        this.operation = {
            operands: [{
                value: '',
                isVariable: false
            }],
            operators: []
        };
    }
}

export class ActionAssignFunction extends Action {
    functionName: string;
    assignTo: string;
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.ASSIGN_FUNCTION;
        this.assignTo = '';
    }
}

export class ActionDeleteVariable extends Action {
    variableName: string
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.DELETE_VARIABLE;
    }
}

export class ActionOnlineAgent extends Action {
    intentName: string;
    trueIntent: string;
    falseIntent: string;
    trueIntentAttributes?: string;
    falseIntentAttributes?: string;
    stopOnConditionMet: boolean;
    constructor() {
        super();
        this.stopOnConditionMet = true;
        this._tdActionType = TYPE_ACTION.ONLINE_AGENTS;
    }
}

export class ActionOpenHours extends Action {
    trueIntent: string;
    falseIntent: string;
    trueIntentAttributes?: string;
    falseIntentAttributes?: string;
    stopOnConditionMet: boolean;
    constructor() {
        super();
        this.stopOnConditionMet = true;
        this._tdActionType = TYPE_ACTION.OPEN_HOURS;
    }
}

export class ActionHideMessage extends Action {
    text: string;
    attributes: {};
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.HIDE_MESSAGE;
        this.attributes = {  subtype: "info"}
    }
}

export class ActionReply extends Action {
    text?: string;
    attributes: Attributes;
    constructor(text?: string, attributes?: Attributes) {
        super();
        // this.text = text ? text : '...';
        this._tdActionType = TYPE_ACTION.REPLY;
        this.attributes = new Attributes();
        if (attributes){
            this.attributes = attributes;
        }
    }
}

export class ActionRandomReply extends Action {
    text?: string;
    attributes: Attributes;
    constructor(text?: string, attributes?: Attributes) {
        super();
        // this.text = text ? text : '...';
        this._tdActionType = TYPE_ACTION.RANDOM_REPLY;
        this.attributes = new Attributes();
        if (attributes){
            this.attributes = attributes;
        }
    }
}

export class ActionWebRequest extends Action {
    method: string;
    url: string;
    headersString: any;
    jsonBody: string;
    assignTo: string;
    assignments: {}
    constructor(){
        super();
        this.url = '';
        this.headersString = {"Content-Type":"application/json", "Cache-Control":"no-cache", "User-Agent":"TiledeskBotRuntime", "Accept":"*/*"};
        this.jsonBody = JSON.stringify({});
        this.assignTo = '';
        this.assignments = {};
        this.method = TYPE_METHOD_REQUEST.GET;
        this._tdActionType = TYPE_ACTION.WEB_REQUEST;
    }
}

export class ActionWebRequestV2 extends Action {
    method: string;
    url: string;
    headersString: any;
    body: string;
    assignResultTo: string;
    assignStatusTo: string;
    assignErrorTo: string;
    trueIntent: string;
    falseIntent: string;
    assignments: {}
    constructor(){
        super();
        this.url = '';
        this.headersString = {"Content-Type":"*/*", "Cache-Control":"no-cache", "User-Agent":"TiledeskBotRuntime", "Accept":"*/*"};
        this.body = null
        this.assignStatusTo = '';
        this.assignErrorTo = '';
        this.assignments = {};
        this.method = TYPE_METHOD_REQUEST.GET;
        this._tdActionType = TYPE_ACTION.WEB_REQUESTV2;
    }
}

export class ActionReplaceBot extends Action {
    botName: string;
    constructor(){
        super();
        this._tdActionType = TYPE_ACTION.REPLACE_BOT;
    }
}

export class ActionChangeDepartment extends Action {
    depName: string;
    constructor(){
        super();
        this._tdActionType = TYPE_ACTION.CHANGE_DEPARTMENT;
    }
}

export class ActionJsonCondition extends Action {
    trueIntent: string;
    falseIntent: string;
    stopOnConditionMet: boolean;
    groups: Array<Expression | Operator>;
    trueIntentAttributes?: string;
    falseIntentAttributes?: string;
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.JSON_CONDITION;
        this.groups = [];
        this.stopOnConditionMet = true;
    }
}

export class ActionIntentConnected extends Action {
    intentName: string;
    json_payload?: Object;
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.INTENT;
    }
}

export class ActionEmail extends Action {
    to: string;
    subject: string;
    text: string;
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.EMAIL;
    }
}

export class ActionWhatsappAttribute extends Action {
    attributeName: string;
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.WHATSAPP_ATTRIBUTE;
    }
}

export class ActionWhatsappStatic extends Action {
    templateName: string;
    payload: WhatsappBroadcast;
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.WHATSAPP_STATIC;
    }
}

export class ActionAgent extends Action{
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.AGENT;
    }
}

export class ActionClose extends Action{
    constructor() {
        super()
        this._tdActionType = TYPE_ACTION.CLOSE;
    }
}

export class ActionWait extends Action {
    millis:number = 500
    constructor() {
        super()
        this._tdActionType = TYPE_ACTION.WAIT;
    
    }
}

export class ActionAskGPT extends Action {
    question: string;
    kbid: string;
    kbName: string;
    assignReplyTo: string;
    assignSourceTo: string;
    trueIntent: string;
    falseIntent: string;
    trueIntentAttributes?: string;
    falseIntentAttributes?: string;
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.ASKGPT
    }
}

export class ActionGPTTask extends Action {
    question: string;
    assignReplyTo: string;
    context: string;
    max_tokens: number;
    temperature: number;
    model: string;
    preview?: Array<any>;
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.GPT_TASK
    }
}

export class ActionCaptureUserReply extends Action {
    assignResultTo: string;
    goToIntent: string;
    constructor() {
        super();
        this._tdActionType = TYPE_ACTION.CAPTURE_USER_REPLY
    }   
}

export class Operation {
    operators?: Array<TYPE_MATH_OPERATOR>
    operands: Array<Operand>
}

export class Operand {
    value: string
    isVariable: boolean
    function?: any
}

export class Attributes {
    disableInputMessage: boolean;
    commands: Command[];
    constructor(commands?: Command[]) {
        this.disableInputMessage = false;
        this.commands = [];
        if(commands && commands.length>0){
            this.commands = commands;
        }
    }
}
export class Command {
    type: string;
    message?: Message;
    time?: number;
    constructor(type: string) {
        this.type = type;
    }
}

export class Wait {
    time: number;
    type: string;
    constructor() {
        this.type = TYPE_COMMAND.WAIT;
        this.time = 500;
    }
}

export class Message {
    text: string;
    type: string;
    attributes?: MessageAttributes;
    metadata?: Metadata;
    _tdJSONCondition?: Expression;
    constructor(type: string, text: string, _tdJSONCondition?: Expression) {
        this.type = type;
        this.text = text;
        if(_tdJSONCondition)
            this._tdJSONCondition = _tdJSONCondition
    }
}

export class MessageWithWait extends Message {
    time?: number = 500;
    constructor(type: string, text: string, time: number, _tdJSONCondition?: Expression) {
        super(type,text, _tdJSONCondition);
        this.time = time?time:500;
    }
}

export class MessageAttributes {
    attachment: Attachment;
    constructor() {
        this.attachment = new Attachment();
    }
}

export class Metadata {
    name?: string;
    src: string;
    width?: number | string;
    height?: number | string; 
    type?: string;
    target?: string;
}

export class Attachment {
    type: string;
    buttons?: Button[];
    gallery?: GalleryElement[];
    constructor() {
        this.type = TYPE_ATTACHMENT.TEMPLATE;
        this.buttons = [];
    }
}

export class Button {
    uid: string;
    __idConnector: string;
    __isConnected: boolean;
    type: string;
    value: string;
    link?: string;
    target?: string;
    action?: string;
    attributes?: any;
    show_echo?: boolean;

    constructor(
        uid: string,
        idConnector: string,
        isConnected: boolean,
        type: string,
        value: string,
        link?: string,
        target?: string,
        action?: string,
        attributes?: any,
        show_echo?: boolean
    ) {
        this.uid = uid;
        this.__idConnector = idConnector;
        this.__isConnected = isConnected;
        this.type = type;
        this.value = value;
        this.link = link;
        this.target = target;
        this.action = action;
        this.attributes = attributes;
        this.show_echo = show_echo;
    }

    // getAttributesExceptIdAndConnected() {
    //     const { idConnector, isConnected, ...otherAttributes } = this;
    //     return otherAttributes;
    // }
}

export interface GalleryElement{
    preview: Metadata;
    title: string;
    description: string;
    buttons: Button[]
}

export interface GalleryElement{
    preview: Metadata;
    title: string;
    description: string;
    buttons: Button[]
}

export class Expression {
    type: string = 'expression';
    conditions: Array<Condition | Operator>
    constructor(){
        // this.conditions = [ new Condition()]
        this.conditions = []
    }
}

export class Operator {
    type: string = 'operator'
    operator: "AND" | "OR" = "OR"
}

export class Condition {
    type: string = 'condition';
    operand1: string = ''
    operator: TYPE_OPERATOR;
    operand2: {
        type: "const" | "var",
        value?: string,
        name?: string
    }

}

export class WhatsappBroadcast {
    id_project: string;
    phone_number_id: string;
    template: {
        language: string;
        name: string;
    }
    receiver_list: Array<any>;
}