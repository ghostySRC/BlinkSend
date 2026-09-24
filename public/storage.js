(() => {
  async function nestedFileHandle(root,relativePath,fallbackName){
    const safe=BlinkSecurity.safeRelativePath(relativePath||fallbackName);if(safe===null)throw new Error('Invalid path');
    const parts=safe.split('/').filter(Boolean);if(parts.length>BlinkSecurity.LIMITS.directoryDepth)throw new Error('Folder depth limit');
    let dir=root;for(const part of parts.slice(0,-1))dir=await dir.getDirectoryHandle(part,{create:true});
    return dir.getFileHandle(parts.at(-1)||fallbackName,{create:true});
  }
  async function collectDirectory(handle,prefix='',depth=0,state={count:0,total:0}){
    if(depth>BlinkSecurity.LIMITS.directoryDepth)throw new Error('Folder depth limit');const entries=[];
    for await(const [name,child] of handle.entries()){
      if(state.count>=BlinkSecurity.LIMITS.batchFiles)throw new Error('Folder file limit');
      const path=prefix?`${prefix}/${name}`:name;if(BlinkSecurity.safeRelativePath(path)===null)throw new Error('Invalid folder path');
      if(child.kind==='directory')entries.push(...await collectDirectory(child,path,depth+1,state));
      else{const file=await child.getFile();state.count++;state.total+=file.size;if(file.size>BlinkSecurity.LIMITS.fileBytes||state.total>BlinkSecurity.LIMITS.batchBytes)throw new Error('Folder size limit');entries.push({file,handle:child,relativePath:path});}
    }
    return entries;
  }
  window.BlinkStorage={nestedFileHandle,collectDirectory};
})();