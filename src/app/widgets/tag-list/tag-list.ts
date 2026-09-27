import {Component, computed, input, InputSignal} from '@angular/core';
import {TAG_COLORS} from "../../core/ui/tags";
import {Tag} from "../tag/tag";

@Component(
    {
        imports: [
            Tag
        ],
        selector: 'tag-list',
        styles: `
            .tag-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
        `,
        template: `
            <div class="tag-list">
                @for (tag of coloredTags(); track tag.label) {
                    <tag [label]="tag.label" [color]="tag.color" />
                }
            </div>
        `,
    }
)


export class TagList {
    tags: InputSignal<readonly string[]> = input.required<readonly string[]>();

    protected readonly coloredTags = computed(() => {
        const tags = this.tags();
        if (tags.length === 0) {
            return [];
        }

        const start: number = this.hash(tags.join('|')) % TAG_COLORS.length;

        return tags.map((label, index) => ({
            label,
            color: TAG_COLORS[(start + index) % TAG_COLORS.length],
        }));
    });

    private hash(value: string): number {
        let hash: number = 0;

        for (let i = 0; i < value.length; i++) {
            hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
        }

        return hash;
    }
}
