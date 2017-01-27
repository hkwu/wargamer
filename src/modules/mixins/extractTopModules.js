/**
 * Extracts the top modules of each type from a given module tree. The modules
 *   with the highest experience cost are considered the 'top' modules.
 * @param {Object} moduleTree - The module tree.
 * @returns {Object} An object containing the top modules of each type found in
 *   the module tree. The module types are the keys and the module data are the values.
 * @private
 */
export default function extractTopModules(moduleTree) {
  return Object.keys(moduleTree).reduce((topModules, moduleId) => {
    const module = moduleTree[moduleId];
    const { price_xp, type } = module;

    if (!topModules[type]) {
      topModules[type] = module;
    } else if (price_xp > topModules[type].price_xp) {
      topModules[type] = module;
    }

    return topModules;
  }, {});
}
