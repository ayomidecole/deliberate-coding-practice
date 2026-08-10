export type DismissNotificationButtonProps = {
  readonly onDismiss: () => void;
};

export function DismissNotificationButton({onDismiss}: DismissNotificationButtonProps) {
  return <button type="button" onClick={onDismiss}>Dismiss notification</button>
}