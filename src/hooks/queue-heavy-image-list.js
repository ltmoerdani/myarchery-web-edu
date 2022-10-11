import * as React from "react";

import { misc } from "utils";

/**
 * Ukuran file image avatar bisa gede banget. Kalau di-load semua
 * sekaligus seperti behavior bawaan browser, browser bisa hang.
 * Ini dipakai untuk nge-load image dari server satu per satu, setelah
 * image di row table sebelumnya sudah selesai di-load.
 *
 * Hook ini dipakai bersama komponen `<HeavyImage />` yang
 * menerima props custom dari hook ini selain atribut standarnya
 * elemen `<img />`.
 *
 * @returns {Object} { checkIsPending, registerQueue, onLoad, onError }
 */
function useQueueHeavyImageList() {
  const [state, dispatch] = React.useReducer(queueReducer, {
    queue: [],
    index: 0,
    loaded: [],
    errors: [],
  });
  const { queue, index: currentQueueIndex } = state;

  const registerQueue = (index) => dispatch({ type: "REGISTER_QUEUE", payload: index });

  const checkIsPending = (imageIdentifier) => {
    const indexInQueue = queue.indexOf("" + imageIdentifier);
    const foundInQueue = indexInQueue > -1;
    return !foundInQueue || indexInQueue > currentQueueIndex;
  };

  const onLoad = async () => {
    await misc.sleep(500);
    dispatch({ type: "IMAGE_LOADED" });
  };

  const onError = () => {
    // TODO: ke image error
    dispatch({ type: "IMAGE_LOADED" });
  };

  return { checkIsPending, registerQueue, onLoad, onError };
}

function queueReducer(state, action) {
  if (action.type === "REGISTER_QUEUE") {
    return {
      ...state,
      queue: [...state.queue, "" + action.payload],
    };
  }

  if (action.type === "IMAGE_LOADED") {
    const { queue: currentQueue, index: currentIndex } = state;
    const tempNextIndex = currentIndex + 1;
    const nextIndex = tempNextIndex >= currentQueue ? currentIndex : tempNextIndex;
    return {
      ...state,
      index: nextIndex,
      loaded: [...state.loaded, currentIndex],
    };
  }

  if (action.type === "IMAGE_ERROR") {
    // TODO: retry
  }

  return state;
}

export { useQueueHeavyImageList };
