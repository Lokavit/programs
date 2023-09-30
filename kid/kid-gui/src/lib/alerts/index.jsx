import React from "react";
import { FormattedMessage } from "react-intl";
import keyMirror from "keymirror";

const AlertTypes = keyMirror({
  STANDARD: null,
  EXTENSION: null,
  INLINE: null,
});

const AlertLevels = {
  SUCCESS: "success",
  INFO: "info",
  WARN: "warn",
};

const alerts = [
  {
    alertId: "createSuccess",
    alertType: AlertTypes.STANDARD,
    clearList: [
      "createSuccess",
      "creating",
      "createCopySuccess",
      "creatingCopy",
      "createRemixSuccess",
      "creatingRemix",
      "saveSuccess",
      "saving",
    ],
    content: GLOBAL_L10N("gui.alerts.createsuccess"),
    iconURL: GLOBAL_URL.ASSET_ICON_SUCCESS,
    level: AlertLevels.SUCCESS,
    maxDisplaySecs: 5,
  },
  {
    alertId: "createCopySuccess",
    alertType: AlertTypes.STANDARD,
    clearList: [
      "createSuccess",
      "creating",
      "createCopySuccess",
      "creatingCopy",
      "createRemixSuccess",
      "creatingRemix",
      "saveSuccess",
      "saving",
    ],
    content: GLOBAL_L10N("gui.alerts.createcopysuccess"),
    iconURL: GLOBAL_URL.ASSET_ICON_SUCCESS,
    level: AlertLevels.SUCCESS,
    maxDisplaySecs: 5,
  },
  {
    alertId: "createRemixSuccess",
    alertType: AlertTypes.STANDARD,
    clearList: [
      "createSuccess",
      "creating",
      "createCopySuccess",
      "creatingCopy",
      "createRemixSuccess",
      "creatingRemix",
      "saveSuccess",
      "saving",
    ],
    content: GLOBAL_L10N("gui.alerts.createremixsuccess"),
    iconURL: GLOBAL_URL.ASSET_ICON_SUCCESS,
    level: AlertLevels.SUCCESS,
    maxDisplaySecs: 5,
  },
  {
    alertId: "creating",
    alertType: AlertTypes.STANDARD,
    clearList: [
      "createSuccess",
      "creating",
      "createCopySuccess",
      "creatingCopy",
      "createRemixSuccess",
      "creatingRemix",
      "saveSuccess",
      "saving",
    ],
    content: GLOBAL_L10N("gui.alerts.creating"),
    iconSpinner: true,
    level: AlertLevels.SUCCESS,
  },
  {
    alertId: "creatingCopy",
    alertType: AlertTypes.STANDARD,
    clearList: [
      "createSuccess",
      "creating",
      "createCopySuccess",
      "creatingCopy",
      "createRemixSuccess",
      "creatingRemix",
      "saveSuccess",
      "saving",
    ],
    content: GLOBAL_L10N("gui.alerts.creatingCopy"),
    iconSpinner: true,
    level: AlertLevels.SUCCESS,
  },
  {
    alertId: "creatingRemix",
    alertType: AlertTypes.STANDARD,
    clearList: [
      "createSuccess",
      "creating",
      "createCopySuccess",
      "creatingCopy",
      "createRemixSuccess",
      "creatingRemix",
      "saveSuccess",
      "saving",
    ],
    content: GLOBAL_L10N("gui.alerts.creatingRemix"),
    iconSpinner: true,
    level: AlertLevels.SUCCESS,
  },
  {
    alertId: "creatingError",
    clearList: [
      "createSuccess",
      "creating",
      "createCopySuccess",
      "creatingCopy",
      "createRemixSuccess",
      "creatingRemix",
      "saveSuccess",
      "saving",
    ],
    closeButton: true,
    content: GLOBAL_L10N("gui.alerts.creatingError"),
    level: AlertLevels.WARN,
  },
  {
    alertId: "savingError",
    clearList: [
      "createSuccess",
      "creating",
      "createCopySuccess",
      "creatingCopy",
      "createRemixSuccess",
      "creatingRemix",
      "saveSuccess",
      "saving",
    ],
    showDownload: true,
    showSaveNow: true,
    closeButton: false,
    content: GLOBAL_L10N("gui.alerts.savingError"),
    level: AlertLevels.WARN,
  },
  {
    alertId: "saveSuccess",
    alertType: AlertTypes.INLINE,
    clearList: ["saveSuccess", "saving", "savingError"],
    content: GLOBAL_L10N("gui.alerts.savesuccess"),
    iconURL: GLOBAL_URL.ASSET_ICON_SUCCESS,
    level: AlertLevels.SUCCESS,
    maxDisplaySecs: 3,
  },
  {
    alertId: "saving",
    alertType: AlertTypes.INLINE,
    clearList: ["saveSuccess", "saving", "savingError"],
    content: GLOBAL_L10N("gui.alerts.saving"),
    iconSpinner: true,
    level: AlertLevels.INFO,
  },
  {
    alertId: "cloudInfo",
    alertType: AlertTypes.STANDARD,
    clearList: ["cloudInfo"],
    content: (
      <FormattedMessage
        defaultMessage="Please note, cloud variables only support numbers, not letters or symbols. {learnMoreLink}" // eslint-disable-line max-len
        description="Info about cloud variable limitations"
        id="gui.alerts.cloudInfo"
        values={{
          learnMoreLink: (
            <a
              href="https://scratch.mit.edu/info/faq/#clouddata"
              rel="noopener noreferrer"
              target="_blank"
            >
              {GLOBAL_L10N("gui.alerts.cloudInfoLearnMore")}
            </a>
          ),
        }}
      />
    ),
    closeButton: true,
    level: AlertLevels.SUCCESS,
    maxDisplaySecs: 15,
  },
  {
    alertId: "importingAsset",
    alertType: AlertTypes.STANDARD,
    clearList: [],
    content: GLOBAL_L10N("gui.alerts.importing"),
    iconSpinner: true,
    level: AlertLevels.SUCCESS,
  },
];

export { alerts as default, AlertLevels, AlertTypes };
