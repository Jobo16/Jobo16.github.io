// @ts-check

/** @typedef {import("../types.js").MemberNode} MemberNode */
/** @typedef {import("../types.js").ProjectNode} ProjectNode */
/** @typedef {import("../types.js").PortalState} PortalState */
/** @typedef {import("../types.js").RouteMode} RouteMode */

/**
 * @typedef {object} CatalogFeatureDeps
 * @property {PortalState} state
 * @property {HTMLElement} treeEl
 * @property {HTMLElement} layoutEl
 * @property {HTMLButtonElement} toggleSidebarBtn
 * @property {(path: string, title: string, rootPath: string, routeSuffix?: string, routeModeOverride?: RouteMode) => void} activatePath
 */

/**
 * @param {CatalogFeatureDeps} deps
 */
export function createCatalogFeature({
  state,
  treeEl,
  layoutEl,
  toggleSidebarBtn,
  activatePath,
}) {
  /**
   * @param {string} text
   * @param {string} className
   * @returns {HTMLButtonElement}
   */
  function createButton(text, className) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tree-item ${className}`.trim();
    btn.textContent = text;
    return btn;
  }

  /**
   * @param {MemberNode[]} memberTree
   * @returns {MemberNode[]}
   */
  function filterMemberTree(memberTree) {
    const keyword = state.searchKeyword.trim();
    /** @type {MemberNode[]} */
    const filtered = [];

    for (const member of memberTree) {
      const memberLabel = member.displayName || member.name;
      if (
        keyword &&
        !memberLabel.includes(keyword) &&
        !member.name.includes(keyword)
      ) {
        continue;
      }
      filtered.push(member);
    }

    return filtered;
  }

  /**
   * @param {boolean} open
   * @returns {void}
   */
  function setAllTreeNodes(open) {
    for (const node of treeEl.querySelectorAll("details")) {
      node.open = open;
    }
  }

  /**
   * @param {boolean} collapsed
   * @returns {void}
   */
  function setSidebarCollapsed(collapsed) {
    state.sidebarCollapsed = collapsed;
    layoutEl.classList.toggle("sidebar-collapsed", collapsed);
    toggleSidebarBtn.textContent = collapsed ? "展开侧边栏" : "收起侧边栏";
  }

  /**
   * @param {MemberNode[]} memberTree
   * @param {string} rootPath
   * @returns {void}
   */
  function renderTree(memberTree, rootPath) {
    treeEl.innerHTML = "";
    state.itemsByPath.clear();
    state.routeModeByPath.clear();

    if (memberTree.length === 0) {
      const msg = document.createElement("div");
      msg.className = "tree-empty";
      msg.textContent = state.searchKeyword
        ? `没有匹配成员：${state.searchKeyword}`
        : "当前没有可展示的目录。";
      treeEl.appendChild(msg);
      return;
    }

    for (const member of memberTree) {
      const memberLabel = member.displayName || member.name;
      const memberDetails = document.createElement("details");
      memberDetails.className = "member-node";
      memberDetails.open = true;

      const memberSummary = document.createElement("summary");
      memberSummary.className = "node-summary";

      const memberLeft = document.createElement("span");
      memberLeft.className = "summary-left";
      const memberName = document.createElement("span");
      memberName.className = "node-name";
      memberName.textContent = memberLabel;
      const memberMeta = document.createElement("span");
      memberMeta.className = "node-meta";
      memberMeta.textContent = `${member.projects.length} 项目`;
      memberLeft.appendChild(memberName);
      memberLeft.appendChild(memberMeta);
      memberSummary.appendChild(memberLeft);
      memberDetails.appendChild(memberSummary);

      const memberContent = document.createElement("div");
      memberContent.className = "member-content";

      for (const project of member.projects) {
        const projectLabel = project.displayName || project.name;
        const routeMode = project.routeMode || "path";
        const hiddenFiles = new Set(project.hiddenFiles || []);

        const projectDetails = document.createElement("details");
        projectDetails.className = "project-node";
        projectDetails.open = false;

        const projectSummary = document.createElement("summary");
        projectSummary.className = "node-summary";

        const projectLeft = document.createElement("span");
        projectLeft.className = "summary-left";
        const projectName = document.createElement("span");
        projectName.className = "node-name";
        projectName.textContent = projectLabel;
        const projectMeta = document.createElement("span");
        projectMeta.className = "node-meta";
        projectMeta.textContent = `${project.files.length} 页面`;
        projectLeft.appendChild(projectName);
        projectLeft.appendChild(projectMeta);
        projectSummary.classList.add("project-summary");
        projectSummary.addEventListener("click", () => {
          activatePath(
            project.entry,
            `${memberLabel} / ${projectLabel}`,
            rootPath,
            "",
            routeMode,
          );
        });
        state.itemsByPath.set(project.entry, projectSummary);
        state.routeModeByPath.set(project.entry, routeMode);
        projectSummary.appendChild(projectLeft);
        projectDetails.appendChild(projectSummary);

        for (const hiddenPath of hiddenFiles) {
          if (hiddenPath !== project.entry) {
            state.itemsByPath.set(hiddenPath, projectSummary);
            state.routeModeByPath.set(hiddenPath, routeMode);
          }
        }

        const extraFiles = project.files.filter(
          (file) => file !== project.entry && !hiddenFiles.has(file),
        );
        if (extraFiles.length > 0) {
          const fileList = document.createElement("div");
          fileList.className = "file-list";

          for (const file of extraFiles) {
            const fileLabel = file.split("/").slice(2).join("/");
            const fileBtn = createButton(fileLabel, "file-btn");
            fileBtn.addEventListener("click", () => {
              activatePath(
                file,
                `${memberLabel} / ${projectLabel} / ${fileLabel}`,
                rootPath,
                "",
                routeMode,
              );
            });

            state.itemsByPath.set(file, fileBtn);
            state.routeModeByPath.set(file, routeMode);
            fileList.appendChild(fileBtn);
          }

          projectDetails.appendChild(fileList);
        }

        memberContent.appendChild(projectDetails);
      }

      memberDetails.appendChild(memberContent);
      treeEl.appendChild(memberDetails);
    }
  }

  /**
   * @param {MemberNode[]} memberTree
   * @returns {{ member: MemberNode; project: ProjectNode } | null}
   */
  function getFirstProject(memberTree) {
    for (const member of memberTree) {
      if (member.projects.length > 0) {
        return { member, project: member.projects[0] };
      }
    }
    return null;
  }

  /**
   * @param {{ autoActivateFirst?: boolean }} [options]
   * @returns {void}
   */
  function renderByCurrentState(options = {}) {
    const { autoActivateFirst = true } = options;
    const filteredTree = filterMemberTree(state.memberTreeRaw);
    renderTree(filteredTree, state.rootPath);

    if (filteredTree.length === 0) {
      return;
    }

    if (state.activePath && state.itemsByPath.has(state.activePath)) {
      activatePath(
        state.activePath,
        state.activeTitle || state.activePath.split("/").join(" / "),
        state.rootPath,
        state.activeRouteSuffix,
      );
      return;
    }

    if (!autoActivateFirst) {
      return;
    }

    const first = getFirstProject(filteredTree);
    if (!first) {
      return;
    }

    activatePath(
      first.project.entry,
      `${first.member.displayName || first.member.name} / ${first.project.displayName || first.project.name}`,
      state.rootPath,
      "",
      first.project.routeMode || "path",
    );
  }

  return {
    filterMemberTree,
    renderByCurrentState,
    renderTree,
    setAllTreeNodes,
    setSidebarCollapsed,
  };
}
