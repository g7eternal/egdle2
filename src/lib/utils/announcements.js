const announcementList = {
  /* ADD NEW ANNOUNCEMENTS BELOW THIS LINE
  ==========================
  */
  puzzleGeneratorFix: {
    text: "A hotfix has been applied for Puzzle game to fix the impossible positions. Also you can now change the grid size. 🥚",
    header: "Puzzle mode fixed!",
  },
  /* 
  ==========================
  DO NOT ADD NEW ANNOUNCEMENTS BELOW THIS LINE 
  */
  firstVisit: {
    text: `If you are new around here,<br>click the <b class="material-icons fs-5 align-text-bottom">help_outline</b> to get help.`,
    header: "Psst... Yu hav eg?",
  },
  firstReturnVisit: {
    header: "🎉 Egdle anniversary!",
    text: "Wow, it's been a year already! On this occasion, Egdle gets a bunch of new features and a fresh design. Enjoy!",
    important: true,
  },
};

export function chooseAnnouncementOnLoad(seenAnnoList) {
  // build unseen announcements list:
  const annoKeys = Object.keys(announcementList);
  const result = {
    seen: seenAnnoList,
    announce: null,
  };

  const important = [],
    generic = [];

  // split all into generic and important, and filter seen ones
  annoKeys.forEach((k) => {
    if (seenAnnoList.includes(k)) return;
    if (announcementList[k].important) {
      important.push(k);
    } else {
      generic.push(k);
    }
  });

  // record all generic announcements as "seen":
  result.seen.push(...generic);

  if (important.length > 0) {
    // if any important announcements available, skip generic announcements
    result.announce = important.shift();
    result.seen.push(result.announce);
  } else if (generic.length > 0) {
    // show last generic announcement only, skip earlier announcements
    result.announce = generic[generic.length - 1];
  } else {
    // no announcements available
    return result;
  }

  // resolve selected announcement id and return info
  result.announce = announcementList[result.announce];
  return result;
}
