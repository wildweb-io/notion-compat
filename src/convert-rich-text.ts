/* eslint-disable max-statements */
import {convertColor} from './convert-color';
import type {Decoration, SubDecoration} from 'notion-types';
import type {RichText, RichTextItem} from './types';

// eslint-disable-next-line complexity
export const convertRichTextItem = (richTextItem: RichTextItem): Decoration => {
	const subdecorations: SubDecoration[] = [];

	if (richTextItem.annotations.bold) {
		subdecorations.push(['b']);
	}

	if (richTextItem.annotations.italic) {
		subdecorations.push(['i']);
	}

	if (richTextItem.annotations.strikethrough) {
		subdecorations.push(['s']);
	}

	if (richTextItem.annotations.underline) {
		subdecorations.push(['_']);
	}

	if (richTextItem.annotations.code) {
		subdecorations.push(['c']);
	}

	if (richTextItem.annotations.color !== 'default') {
		subdecorations.push(['h', convertColor(richTextItem.annotations.color)]);
	}

	const details = richTextItem[richTextItem.type];

	if (details && details.link) {
		subdecorations.push(['a', details.link.url]);
	}

	switch (richTextItem.type) {
		case 'text': {
			if (subdecorations.length > 0) {
				return [richTextItem.text.content, subdecorations];
			}

			return [richTextItem.text.content];
		}

		case 'equation': {
			if (richTextItem.equation?.expression) {
				subdecorations.unshift(['e', richTextItem.equation.expression]);
			}

			return ['⁍', subdecorations];
		}

		case 'mention': {
			const {mention} = richTextItem;

			if (mention) {
				switch (mention.type) {
					case 'link_preview': {
						// TODO: this should be an eoi, but we don't hae the proper data
						subdecorations.push(['a', mention.link_preview.url]);

						break;
					}

					case 'page': {
						subdecorations.push(['p', mention.page.id]);

						return ['‣', subdecorations];
					}

					case 'database': {
						subdecorations.push(['p', mention.database.id]);

						return ['‣', subdecorations];
					}

					case 'date': {
						subdecorations.unshift([
							'd',
							{
								end_date: mention.date.end,
								start_date: mention.date.start,
								time_zone: mention.date.time_zone,
								type: 'date', // TODO
							},
						]);

						break;
					}

					case 'user': {
						subdecorations.push(['u', mention.user.id]);

						break;
					}

					case 'template_mention': {
						/* TODO
						   subdecorations.push(['m', mention.template_mention.type]) */
						break;
					}

					default: {
						// TODO
						break;
					}
				}
			}

			return [richTextItem.plain_text, subdecorations];
		}

		default: {
			return [''];
		}
	}
};

export const convertRichText = (richText: RichText): Decoration[] => {
	return richText.map(convertRichTextItem).filter(Boolean);
};
