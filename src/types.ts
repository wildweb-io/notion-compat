import type {Client} from '@notionhq/client';

type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends ReadonlyArray<infer ElementType> ? ElementType : never;

export type PartialPage = Awaited<
	ReturnType<InstanceType<typeof Client>['pages']['retrieve']>
>;

export type Page = Extract<
	Awaited<ReturnType<InstanceType<typeof Client>['pages']['retrieve']>>,
	{url: string}
>;

export type PartialBlock = Awaited<
	ReturnType<InstanceType<typeof Client>['blocks']['retrieve']>
>;

export type Block = Extract<PartialBlock, {type: string}>;

export type BlockChildren = Awaited<
	ReturnType<InstanceType<typeof Client>['blocks']['children']['list']>
>['results'];

export type RichText = Extract<
	Block,
	{type: 'paragraph'}
>['paragraph']['rich_text'];
export type RichTextItem = ArrayElement<RichText>;

export type PageMap = {[key: string]: PartialPage};
export type BlockMap = {[key: string]: PartialBlock};
export type BlockChildrenMap = {[key: string]: string[]};

export type ParentMap = {[key: string]: string};
