import { LiteDebouncer } from "@tanstack/pacer-lite/lite-debouncer";
import { useInfiniteQuery } from "@tanstack/solid-query";
import { For, JSXElement, Show } from "solid-js";

import { forkChangelog } from "../../constants/fork-changelog";
import { getVersionHistoryQueryOptions } from "../../queries/public";
import { isModalOpen } from "../../states/modals";
import { AnimatedModal } from "../common/AnimatedModal";
import AsyncContent from "../common/AsyncContent";
import { LoadingCircle } from "../common/LoadingCircle";

export function VersionHistoryModal(): JSXElement {
  const isOpen = (): boolean => isModalOpen("VersionHistory");

  const releases = useInfiniteQuery(() => ({
    ...getVersionHistoryQueryOptions(),
    enabled: isOpen(),
  }));

  const debouncedFetch = new LiteDebouncer(
    (callback: () => void) => callback(),
    { wait: 150 },
  );

  const fetchMoreVersions = (e: Event): void => {
    const element = e.target as HTMLElement;

    debouncedFetch.maybeExecute(() => {
      if (
        element.scrollHeight - element.scrollTop - element.clientHeight < 10 &&
        releases.hasNextPage &&
        !releases.isLoading
      ) {
        void releases.fetchNextPage();
      }
    });
  };

  return (
    <AnimatedModal
      id="VersionHistory"
      modalClass="max-w-6xl"
      onScroll={fetchMoreVersions}
    >
      <ForkChanges />
      <AsyncContent
        queries={{ releases }}
        errorMessage="Failed to load version history"
      >
        {({ releasesData }) => (
          <>
            <div class="releases">
              <For each={releasesData().pages.flatMap((it) => it.releases)}>
                {(release) => <ReleaseItem {...release} />}
              </For>
            </div>

            <div class="mb-8 text-center text-2xl">
              <Show when={releases.isFetching}>
                <LoadingCircle color="sub" />
              </Show>
            </div>
          </>
        )}
      </AsyncContent>
    </AnimatedModal>
  );
}

function ReleaseItem(props: {
  name: string;
  publishedAt: string;
  bodyHTML: string;
}): JSXElement {
  return (
    <div class="grid gap-4">
      <div class="flex place-items-center justify-between">
        <div class="text-4xl text-main">{props.name}</div>
        <div class="text-sub">{props.publishedAt}</div>
      </div>
      {/* oxlint-disable-next-line solid/no-innerhtml */}
      <div innerHTML={props.bodyHTML}></div>
      <div class="mt-4 mb-16 h-1 w-full rounded bg-sub-alt"></div>
    </div>
  );
}

function ForkChanges(): JSXElement {
  return (
    <div class="grid gap-4" data-testid="fork-changes">
      <div class="flex place-items-center justify-between">
        <div class="text-4xl text-main">fork changes</div>
        <a
          class="text-sub"
          href="https://github.com/FairyVR/monkeytype/commits/master"
          target="_blank"
          rel="noopener noreferrer"
        >
          FairyVR/monkeytype
        </a>
      </div>
      <ul class="grid list-disc gap-1 pl-6">
        <For each={forkChangelog}>
          {(change) => (
            <li>
              <span class="text-sub">{change.date}</span> {change.text}
              <Show when={change.issue}>
                {(issue) => (
                  <>
                    {" "}
                    <a
                      href={`https://github.com/monkeytypegame/monkeytype/issues/${issue()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      #{issue()}
                    </a>
                  </>
                )}
              </Show>
            </li>
          )}
        </For>
      </ul>
      <div class="mt-4 mb-16 h-1 w-full rounded bg-sub-alt"></div>
    </div>
  );
}
