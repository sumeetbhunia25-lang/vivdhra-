const fs = require('fs');
const walk = (dir) => {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = dir === '.' ? file : dir + '/' + file;
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('dist')) {
          results = results.concat(walk(fullPath));
        }
      } else {
        results.push(fullPath);
      }
    });
  } catch (e) {
    // Ignore error
  }
  return results;
};

const files = walk('.');
console.log('ALL FILES:', files);
