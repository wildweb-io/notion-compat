import type {Color} from 'notion-types';

export const convertColor = (color: string): Color => {
	switch (color) {
		case 'green': {
			return 'teal';
		}

		case 'green_background': {
			return 'teal_background';
		}

		default: {
			return color as Color;
		}
	}
};
