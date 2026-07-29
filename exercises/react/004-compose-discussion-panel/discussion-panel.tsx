import { DiscussionSummary } from './discussion-summary';

export type DiscussionPanelProps = {
    readonly title: string;
    readonly commentCount: number;
    readonly authorName: string;
};

export function DiscussionPanel({
    title,
    commentCount,
    authorName,
}: DiscussionPanelProps) {
    return (
        <div>
            <DiscussionSummary title={title} commentCount={commentCount} />
            <p>Started by {authorName}</p>
        </div>
    );
}
