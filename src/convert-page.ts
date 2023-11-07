import {convertBlock} from './convert-block';
import type {Block, ExtendedRecordMap} from 'notion-types';
import type {
	Block as Block1,
	BlockChildrenMap,
	BlockMap,
	Page,
	PageMap,
	ParentMap,
} from './types';

export const convertPageBlock = ({
	pageId,
	blockMap,
	blockChildrenMap,
	pageMap,
	parentMap,
}: {
	pageId: string;
	blockMap: BlockMap;
	blockChildrenMap: BlockChildrenMap;
	pageMap: PageMap;
	parentMap: ParentMap;
}): Block | null => {
	const partialPage = pageMap[pageId];
	const page = partialPage as Page;

	if (page) {
		const compatPageBlock = convertBlock({
			block: {...page, type: 'child_page'} as unknown as Block1,
			blockMap,
			children: blockChildrenMap[page.id],
			pageMap,
			parentMap,
		});

		return compatPageBlock;
	}

	return null;
};

export const convertPage = ({
	pageId,
	blockMap,
	blockChildrenMap,
	pageMap,
	parentMap,
}: {
	pageId: string;
	blockMap: BlockMap;
	blockChildrenMap: BlockChildrenMap;
	pageMap: PageMap;
	parentMap: ParentMap;
}): ExtendedRecordMap => {
	const compatBlocks = Object.values(blockMap).map(block =>
		convertBlock({
			block,
			blockMap,
			children: blockChildrenMap[block.id],
			pageMap,
			parentMap,
		}),
	);

	const compatPageBlock = convertPageBlock({
		blockChildrenMap,
		blockMap,
		pageId,
		pageMap,
		parentMap,
	});

	const compatPageBlocks = Object.keys(pageMap)
		.filter(id => id !== pageId)
		.map(id =>
			convertPageBlock({
				blockChildrenMap,
				blockMap,
				pageId: id,
				pageMap,
				parentMap,
			}),
		);

	const compatBlockMap = Object.fromEntries(
		[compatPageBlock, ...compatBlocks, ...compatPageBlocks].map(block => [
			block.id,
			{
				type: 'reader',
				value: block,
			},
		]),
	);

	return {
		// @ts-expect-error wrong types
		block: compatBlockMap,
		collection: {},
		collection_query: {},
		collection_view: {},
		notion_user: {},
		signed_urls: {},
	};
};
