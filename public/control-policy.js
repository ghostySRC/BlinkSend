(() => {
  const preVerification=new Set(['hello','verify-confirm','resume','resume-map','cancel']);
  const known=new Set(['hello','verify-confirm','benchmark-start','benchmark-ready','benchmark-end','benchmark-ack','batch-request','batch-accept','batch-decline','batch-complete','request','accept','flow','resume','resume-map','retry','decline','cancel','complete','saved','text-start','text-part','text-end','text']);
  function allowed(type,verified){return typeof type==='string'&&known.has(type)&&(verified||preVerification.has(type));}
  window.BlinkControlPolicy={allowed,preVerification,known};
})();