
(function(){
  var q=document.getElementById('gq');if(!q)return;
  var form=document.getElementById('gform'),msg=document.getElementById('gmsg'),cnt=document.getElementById('gcount');
  var items=[].slice.call(document.querySelectorAll('#english .t'));
  var heads=[].slice.call(document.querySelectorAll('#english h4.cty'));
  var det=[].slice.call(document.querySelectorAll('#english details')).filter(function(d){return d.querySelector('.t')});
  var openInit=det.map(function(d){return d.open});
  var reduce=false;try{reduce=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
  function norm(x){return String(x).toLowerCase().replace(/ё/g,'е').replace(/\s+/g,' ').trim()}
  /* the search index is built once from the cards that are already on the page */
  var idx=items.map(function(it){
    var b=it.querySelector('b'),tr=it.querySelector('.tr');
    return {el:it,text:norm(it.textContent),head:norm((b?b.textContent:'')+' '+(tr?tr.textContent:''))};
  });
  function has(text,v){
    if(text.indexOf(v)>=0)return true;
    var w=v.split(' ');
    if(w.length<2)return false;
    for(var i=0;i<w.length;i++){if(text.indexOf(w[i])<0)return false}
    return true;
  }
  function run(){
    var raw=q.value,v=norm(raw),n=0,nHead=0,first=null,firstHead=null;
    idx.forEach(function(r){
      var ok=!v||has(r.text,v);
      r.el.hidden=!ok;
      if(ok&&v){n++;if(!first)first=r.el;if(has(r.head,v)){nHead++;if(!firstHead)firstHead=r.el}}
    });
    heads.forEach(function(h){var nx=h.nextElementSibling,any=false;if(nx){[].slice.call(nx.children).forEach(function(c){if(!c.hidden)any=true})}h.hidden=!any});
    det.forEach(function(d,i){
      var any=!!d.querySelector('.t:not([hidden])');
      d.hidden=!!v&&!any;
      d.open=v?any:openInit[i];
    });
    if(cnt)cnt.textContent='';
    var cl=raw.replace(/\s+/g,' ').trim(),shown=cl.length>40?cl.slice(0,40)+'…':cl;
    if(!v)msg.textContent='';
    else if(!n)msg.textContent='«'+shown+'» не найдено в словаре LAWSTART. Проверьте написание, попробуйте другое слово или найдите термин во внешних источниках ниже.';
    else if(nHead)msg.textContent='Найдено в словаре LAWSTART: '+n+'.';
    else msg.textContent='Отдельной записи «'+shown+'» в словаре нет, но слово встречается в описаниях и примерах: '+n+'. Эти карточки показаны ниже.';
    return firstHead||first;
  }
  q.addEventListener('input',function(){run()});
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var f=run();
    if(!norm(q.value)){msg.textContent='Введите слово или фразу, например indemnify.';q.focus();return}
    if(f){try{f.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})}catch(e){f.scrollIntoView()}}
    try{q.blur()}catch(e){}
  });

  /* ---- external sources: open the official site in a new tab ---- */
  var SRC={
    wex:{name:'Cornell LII / Wex',url:'https://www.law.cornell.edu/search/wex',pass:false},
    aba:{name:'ABA',url:'https://www.americanbar.org/search/',pass:false},
    leg:{name:'legislation.gov.uk',url:'https://www.legislation.gov.uk/all?title=',pass:true,
         hint:'Запрос передаётся автоматически: поиск идёт по словам в названиях актов Великобритании (не по определениям терминов).'},
    ls:{name:'The Law Society',url:'https://www.lawsociety.org.uk/',pass:false},
    sra:{name:'SRA',url:'https://www.sra.org.uk/',pass:false}
  };
  var NOPASS='Запрос на этот сайт не передаётся автоматически. Откроется официальная страница, введите термин в поисковое поле открывшегося сайта.';
  var xs=document.getElementById('xsrc'),xb=document.getElementById('xbtn'),xh=document.getElementById('xhint'),xm=document.getElementById('xmsg');
  function hint(){var s=SRC[xs.value];xh.textContent=s.pass?s.hint:NOPASS}
  hint();xs.addEventListener('change',function(){hint();xm.textContent=''});
  xb.addEventListener('click',function(){
    var s=SRC[xs.value],term=q.value.replace(/\s+/g,' ').trim();
    if(!term){xm.textContent='Сначала введите термин в поле поиска выше.';q.focus();return}
    var url=s.pass?s.url+encodeURIComponent(term):s.url;
    var w=null;try{w=window.open(url,'_blank','noopener,noreferrer')}catch(e){}
    xm.textContent='';
    var t=document.createElement('span');
    var warn=/[Ѐ-ӿ]/.test(term)?' Внешние сайты на английском: введите термин по-английски.':'';
    t.textContent=(w?'Открыт источник «'+s.name+'» в новой вкладке. ':'Браузер заблокировал новую вкладку. ')+(s.pass?'':'Введите термин в поисковое поле открывшегося сайта. ');
    xm.appendChild(t);
    var a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=w?'Открыть ещё раз':'Открыть «'+s.name+'»';
    xm.appendChild(a);
    if(warn)xm.appendChild(document.createTextNode(warn));
    if(!s.pass){
      try{
        if(navigator.clipboard&&navigator.clipboard.writeText){
          navigator.clipboard.writeText(term).then(function(){xm.appendChild(document.createTextNode(' Термин скопирован: вставьте его в поиск сайта.'))},function(){});
        }
      }catch(e){}
    }
  });
})();

try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelectorAll('figure svg').forEach(function(v){v.pauseAnimations()})}catch(e){}
(function(){
  var T=[
    ['What does “indemnify” mean?',['To terminate a contract','To compensate for a loss','To transfer ownership','To settle a dispute'],1,'Indemnify: возместить убытки или расходы другой стороны.'],
    ['Which phrase means «применимое право»?',['breach of contract','force majeure','governing law','consideration'],2,'Governing law — право, которому стороны подчинили договор.'],
    ['Late delivery that violates the contract is a…',['breach of contract','governing law','indemnity','jurisdiction'],0,'Breach of contract — нарушение договора.']
  ],i=0,score=0,q=document.getElementById('mtq'),o=document.getElementById('mto'),r=document.getElementById('mtr'),n=document.getElementById('mtn');
  if(!q||!o||!r||!n)return;
  function show(){
    var t=T[i];q.textContent=(i+1)+'/'+T.length+'. '+t[0];q.setAttribute('lang','en');o.innerHTML='';r.textContent='';n.hidden=true;
    t[1].forEach(function(x,k){var b=document.createElement('button');b.type='button';b.textContent=x;b.setAttribute('lang','en');
      b.onclick=function(){
        var bs=o.children;for(var j=0;j<bs.length;j++){bs[j].disabled=true}
        if(k===t[2]){b.className='ok';score++;r.textContent='Верно. '+t[3]}else{b.className='no';bs[t[2]].className='ok';r.textContent='Не совсем. '+t[3]}
        n.textContent=i<T.length-1?'Дальше':'Результат';n.hidden=false};
      o.appendChild(b)})
  }
  n.onclick=function(){
    if(i<T.length-1){i++;show()}
    else if(n.textContent==='Результат'){q.removeAttribute('lang');q.textContent='Результат: '+score+' из '+T.length+'. Это учебная диагностика, а не официальный тест CEFR/IELTS.';o.innerHTML='';r.textContent='';n.textContent='Пройти заново';n.hidden=false}
    else{i=0;score=0;show()}
  };
  show();
})();

(function(){
  var l=document.querySelectorAll('.leroute a[data-open]');
  for(var i=0;i<l.length;i++){l[i].addEventListener('click',function(){var d=document.getElementById(this.getAttribute('data-open'));if(d)d.open=true})}
})();


/* ===== LAWSTART Legal English course: DATA =====
   Levels are LAWSTART project levels, not CEFR certification.
   Each level: rev (content revision; saved results of another revision are not counted), topics, goals, concepts,
   vocab, terms (structured term cards), lessons (text + translation + key expressions + tasks), texts, speak, test.
   Question format: {q:"stem", o:["A","B","C","D"], a:indexOfCorrect, why:"explanation shown after the test"}.
   Lesson task: {k:"mcq", q, o, a, why} (checked at once, not scored) or {k:"open", q, model, why} (self-check, not scored).
   Jurisdiction tags: US, EW (England and Wales), INT (international / cross-border), KZ (Kazakhstan). */
var LEC_PASS_PERCENT = 80;
var LEC_JUR = {US:"US Law", EW:"England and Wales", INT:"International / Cross-border", KZ:"Kazakhstan"};
var LEC_LEVELS = [
 {
  "id": 1,
  "ready": true,
  "title": "Foundations of Legal English",
  "ru": "Основы юридического английского",
  "cefr": "ориентир: примерно A2–B1 (проектная модель LAWSTART, не сертификация CEFR)",
  "summary": "Стороны, права и обязанности, юридические лица, must/shall/may/can, условия и сроки, простые документы.",
  "goals": [
   {
    "en": "Recognise and use core legal words: party, clause, obligation, liability, breach, agreement, enforceable, remedy.",
    "ru": "Узнавать и использовать базовые юридические слова."
   },
   {
    "en": "Tell the difference between a right, a duty and a prohibition in a short legal sentence.",
    "ru": "Различать право, обязанность и запрет в коротком юридическом предложении."
   },
   {
    "en": "Understand the meaning of shall, may, must and must not.",
    "ru": "Понимать значение shall, may, must и must not."
   },
   {
    "en": "Read a short legal statement and answer questions about who must do what.",
    "ru": "Читать короткое юридическое положение и отвечать, кто что должен делать."
   }
  ],
  "concepts": [
   {
    "h": "Who is who: parties, rights, duties",
    "en": "A legal text usually names the parties: the people or organisations involved in an agreement or a legal case. Each party has rights (things it is allowed to do or to receive) and duties or obligations (things it must do). If a party does not do what it must do, this may be a breach, and the other party may ask for a remedy."
   },
   {
    "h": "Liability",
    "en": "Liability means legal responsibility. A party that is liable for a loss may have to pay for it or to put things right. How far liability goes depends on the contract and on the law that applies."
   },
   {
    "h": "Basic sentence patterns: shall, may, must, must not",
    "en": "Traditional legal drafting uses shall for an obligation: “The Seller shall deliver the goods.” May gives permission: “The Buyer may inspect the goods.” The Buyer is allowed to inspect, but does not have to. Must is also used for obligations and is common in modern plain-English drafting. Must not and shall not express a prohibition."
   },
   {
    "h": "Conditions: if, unless, provided that",
    "en": "Many legal sentences have a condition. “If the goods are late, the Buyer may cancel.” means: late goods give the Buyer the right to cancel. “Unless the Buyer pays in full, the Seller is not required to deliver.” means: delivery is required only when the Buyer has paid in full."
   },
   {
    "h": "Legal persons and organisations",
    "en": "A natural person is a human being. A legal person (or legal entity) is an organisation, such as a company, that the law treats as having its own rights and duties. A company signs contracts through people who have authority to act for it, for example a director. The form of a company (Ltd, LLC, LLP) depends on the country, so the exact name, form and country should be stated in a contract."
   },
   {
    "h": "May, can and must not: common mistakes",
    "en": "Use may for permission (“The Buyer may inspect”), must or shall for an obligation, and must not for a prohibition. Avoid can in formal drafting when you mean permission, because can often describes ability. May not can be read in two ways, so must not is clearer."
   }
  ],
  "vocab": [
   {
    "t": "party",
    "ru": "сторона",
    "def": "a person or organisation that takes part in an agreement or a legal case",
    "ex": "Both parties signed the agreement on Monday."
   },
   {
    "t": "agreement",
    "ru": "соглашение, договорённость",
    "def": "a promise or set of promises between two or more parties",
    "ex": "The agreement is in writing."
   },
   {
    "t": "clause",
    "ru": "пункт, условие (договора)",
    "def": "one numbered part of a contract or other legal document",
    "ex": "Clause 5 explains how to cancel the contract."
   },
   {
    "t": "right",
    "ru": "право",
    "def": "something a person or organisation is allowed to do or to receive",
    "ex": "The tenant has the right to a clean flat."
   },
   {
    "t": "duty / obligation",
    "ru": "обязанность",
    "def": "something a person or organisation must do",
    "ex": "The seller’s main obligation is to deliver the goods."
   },
   {
    "t": "liability",
    "ru": "ответственность",
    "def": "legal responsibility, for example to pay for loss or damage",
    "ex": "The company has no liability for lost luggage."
   },
   {
    "t": "breach",
    "ru": "нарушение",
    "def": "failing to do what a contract or the law requires",
    "ex": "Late payment can be a breach of contract."
   },
   {
    "t": "enforceable",
    "ru": "подлежащий принудительному исполнению",
    "def": "something a court can require people to obey",
    "ex": "An enforceable agreement can be defended in court."
   },
   {
    "t": "remedy",
    "ru": "средство правовой защиты",
    "def": "what the law gives a person after a wrong, for example damages (money) or an order to perform",
    "ex": "The buyer’s remedy was a refund."
   },
   {
    "t": "damages",
    "ru": "возмещение убытков (денежная компенсация)",
    "def": "money a court orders one party to pay to another for loss or harm",
    "ex": "The court awarded damages for the delay."
   },
   {
    "t": "binding",
    "ru": "обязательный, имеющий обязательную силу",
    "def": "creating a legal duty that must be followed",
    "ex": "The signed contract is binding on both parties."
   },
   {
    "t": "prohibit",
    "ru": "запрещать",
    "def": "to say officially that something must not be done",
    "ex": "The lease prohibits smoking inside the flat."
   }
  ],
  "texts": [
   {
    "title": "Text 1: Sale of goods (original example)",
    "body": [
     "1. The Seller shall deliver the goods to the Buyer by 1 June.",
     "2. The Buyer may inspect the goods within three days of delivery.",
     "3. If the Seller delivers the goods late, the Buyer may cancel the agreement.",
     "4. The Buyer must pay the price within 14 days of delivery."
    ],
    "note": "General example. Real contracts and the applicable law differ between countries.",
    "qs": [
     {
      "q": "Who has an obligation to deliver the goods?",
      "o": [
       "The Buyer",
       "The Seller",
       "Both parties",
       "Nobody"
      ],
      "a": 1,
      "why": "Clause 1: “The Seller shall deliver” — shall expresses a duty of the Seller."
     },
     {
      "q": "Must the Buyer inspect the goods?",
      "o": [
       "Yes, always",
       "No, the Buyer may inspect but does not have to",
       "No, inspection is prohibited",
       "Only the Seller can inspect"
      ],
      "a": 1,
      "why": "Clause 2 uses may: it gives permission, not a duty."
     },
     {
      "q": "What can the Buyer do if delivery is late?",
      "o": [
       "Cancel the agreement",
       "Keep the goods for free",
       "Deliver the goods",
       "Nothing"
      ],
      "a": 0,
      "why": "Clause 3: If the Seller delivers late, the Buyer may cancel the agreement."
     }
    ]
   },
   {
    "title": "Text 2: Rental flat (original example)",
    "body": [
     "1. The Tenant must pay the rent on the first day of each month.",
     "2. The Landlord shall keep the flat in good condition.",
     "3. The Tenant must not keep animals in the flat.",
     "4. Unless the Landlord agrees in writing, the Tenant may not sublet the flat."
    ],
    "note": "General example. Rules for rental agreements depend on the country and the contract.",
    "qs": [
     {
      "q": "Which sentence is a prohibition?",
      "o": [
       "Clause 1",
       "Clause 2",
       "Clause 3",
       "None of them"
      ],
      "a": 2,
      "why": "“must not keep animals” is a prohibition."
     },
     {
      "q": "When may the Tenant sublet the flat?",
      "o": [
       "Whenever the Tenant wants",
       "Never",
       "Only if the Landlord agrees in writing",
       "Only if the animals leave"
      ],
      "a": 2,
      "why": "“Unless the Landlord agrees in writing” — written consent is the condition."
     },
     {
      "q": "Who must keep the flat in good condition?",
      "o": [
       "The Tenant",
       "The Landlord",
       "A neighbour",
       "The court"
      ],
      "a": 1,
      "why": "Clause 2: The Landlord shall keep the flat in good condition."
     }
    ]
   }
  ],
  "speak": {
   "phrases": [
    {
     "en": "The Seller shall deliver the goods by the first of June.",
     "ru": "Продавец обязан поставить товар до 1 июня."
    },
    {
     "en": "The Buyer may inspect the goods, but does not have to.",
     "ru": "Покупатель вправе осмотреть товар, но не обязан."
    },
    {
     "en": "If a party breaches the agreement, the other party may ask for a remedy.",
     "ru": "Если сторона нарушает соглашение, другая сторона может требовать защиты права."
    },
    {
     "en": "Unless the Buyer pays in full, the Seller is not required to deliver.",
     "ru": "Пока покупатель не заплатит полностью, продавец не обязан поставлять."
    }
   ],
   "dialogue": {
    "title": "Dialogue: a student asks a tutor",
    "lines": [
     {
      "who": "Student",
      "en": "Excuse me, what does “obligation” mean in this contract?"
     },
     {
      "who": "Tutor",
      "en": "An obligation is something a party must do."
     },
     {
      "who": "Student",
      "en": "And what about “may”?"
     },
     {
      "who": "Tutor",
      "en": "May gives permission. The party is allowed to act, but does not have to."
     },
     {
      "who": "Student",
      "en": "So “shall deliver” means the Seller has a duty?"
     },
     {
      "who": "Tutor",
      "en": "Exactly. If the Seller does not deliver, that can be a breach."
     }
    ]
   },
   "prompts": [
    {
     "q": "Explain in your own words the difference between “may” and “must”.",
     "model": "May gives a permission, so the person can choose. Must creates an obligation, so the person has no choice."
    },
    {
     "q": "Describe one obligation of a tenant and one obligation of a landlord.",
     "model": "The tenant must pay the rent on time. The landlord must keep the flat in good condition."
    }
   ]
  },
  "test": [
   {
    "q": "In a contract, a “party” is …",
    "o": [
     "a celebration after signing",
     "a person or organisation that takes part in the agreement",
     "one numbered section of the contract",
     "the judge who reads the contract"
    ],
    "a": 1,
    "why": "Party = сторона договора. Numbered sections are clauses."
   },
   {
    "q": "“Liability” means …",
    "o": [
     "permission to enter a building",
     "a list of documents",
     "a court building",
     "legal responsibility, for example to pay for harm or loss"
    ],
    "a": 3,
    "why": "Liability = юридическая ответственность."
   },
   {
    "q": "Which sentence expresses an obligation?",
    "o": [
     "The Tenant shall pay the rent on the first day of each month.",
     "The Tenant may sublet the flat.",
     "The Tenant might leave early.",
     "The Tenant is welcome to ask questions."
    ],
    "a": 0,
    "why": "Shall + verb creates a duty. May gives permission; might and “is welcome” are not obligations."
   },
   {
    "q": "“The Buyer may inspect the goods.” This means the Buyer …",
    "o": [
     "must inspect the goods",
     "is forbidden to inspect the goods",
     "is allowed to inspect the goods but does not have to",
     "has already inspected the goods"
    ],
    "a": 2,
    "why": "May = разрешение (право), а не обязанность."
   },
   {
    "q": "A “breach” of contract is …",
    "o": [
     "failing to do what the contract requires",
     "signing a contract",
     "ending a contract by agreement",
     "a payment of money"
    ],
    "a": 0,
    "why": "Breach = нарушение: the party does not do what it promised."
   },
   {
    "q": "An “enforceable” agreement is one that …",
    "o": [
     "nobody has read",
     "is written in Latin",
     "has no parties",
     "a court can require the parties to follow"
    ],
    "a": 3,
    "why": "Enforceable = подлежащий принудительному исполнению."
   },
   {
    "q": "A “remedy” is …",
    "o": [
     "a medicine",
     "what the law gives a person after a wrong, for example damages",
     "a type of contract",
     "a lawyer’s fee"
    ],
    "a": 1,
    "why": "Remedy = средство защиты (например, damages — денежное возмещение)."
   },
   {
    "q": "Text: “The Seller shall deliver the goods by 1 June. If the Seller delivers late, the Buyer may cancel the agreement.” What can the Buyer do if delivery is late?",
    "o": [
     "The Buyer must keep the goods",
     "The Buyer must pay extra",
     "The Buyer may cancel the agreement",
     "The Buyer must deliver the goods"
    ],
    "a": 2,
    "why": "“If … late, the Buyer may cancel” — the Buyer has the right to cancel."
   },
   {
    "q": "“The Tenant must not keep animals in the flat.” This rule is …",
    "o": [
     "a permission",
     "a requirement to keep animals",
     "an option for the Landlord only",
     "a prohibition"
    ],
    "a": 3,
    "why": "Must not = запрет."
   },
   {
    "q": "Text: “Unless the Buyer pays in full, the Seller is not required to deliver.” When must the Seller deliver?",
    "o": [
     "Always",
     "Only if the Buyer has paid in full",
     "Only if the Seller wants to",
     "Before the Buyer pays anything"
    ],
    "a": 1,
    "why": "“Unless …” introduces a condition: no full payment, no duty to deliver."
   },
   {
    "q": "Which of the following is a legal person?",
    "o": [
     "The director of a company, as a human being",
     "A court order",
     "A clause in a contract",
     "A registered company"
    ],
    "a": 3,
    "why": "Legal person = организация, признаваемая правом самостоятельным субъектом (например, компания). Директор — natural person."
   },
   {
    "q": "“The Customer must pay each invoice within 14 days after receiving it.” What starts the 14-day period?",
    "o": [
     "The date of the contract",
     "The Customer’s receipt of the invoice",
     "The date of the first delivery",
     "The end of the year"
    ],
    "a": 1,
    "why": "Within 14 days after receiving it — период начинается с получения счёта."
   }
  ],
  "rev": 2,
  "topics": [
   "parties, rights and duties",
   "legal persons and organisations",
   "obligations and permissions: must, shall, may, can",
   "conditions and deadlines",
   "basic legal terminology",
   "simple legal documents"
  ],
  "terms": [
   {
    "t": "party",
    "plain": "A person or organisation that takes part in an agreement or in a legal case.",
    "ru": "сторона (договора, дела)",
    "jx": [
     {
      "j": "INT",
      "t": "Слово используется во всех правовых системах: a party to a contract, a party to a case. В договоре стороны обычно названы в начале и затем обозначены коротко: the Seller, the Buyer."
     },
     {
      "j": "KZ",
      "t": "В казахстанском праве аналог — «сторона» договора; в английском тексте проверьте, кого именно называет документ: юридическое лицо или физическое лицо."
     }
    ],
    "ex": "The Seller and the Buyer are the parties to this Agreement.",
    "mistake": "Считать, что директор компании — отдельная сторона договора. Если директор подписывает от имени компании, стороной является компания.",
    "vs": "party (участник договора) отличается от third party (третье лицо): то лицо, которое не является стороной договора.",
    "task": {
     "q": "Who are the “parties” to a contract?",
     "o": [
      "The persons or organisations that make the agreement",
      "The lawyers who read the contract",
      "The judges of the court",
      "The witnesses who watch the signing"
     ],
     "a": 0,
     "why": "Parties = стороны договора. Юристы, судьи и свидетели не являются сторонами, если сами не заключали договор."
    }
   },
   {
    "t": "obligation (duty)",
    "plain": "Something that a person or organisation must do (or must not do) because of a contract or the law.",
    "ru": "обязанность, обязательство",
    "jx": [
     {
      "j": "INT",
      "t": "В контракте обязанность чаще всего выражена словами shall или must: The Seller shall deliver the goods. Если обязанность не выполнена, это может быть breach."
     },
     {
      "j": "KZ",
      "t": "Русское слово «обязательство» шире: оно может обозначать целое правоотношение (долг и право требования), а не только «обязанность». Английское obligation в договоре обычно ближе к «обязанности»."
     }
    ],
    "ex": "The Buyer’s main obligation is to pay the price.",
    "mistake": "Переводить obligation только как «облигация» или «обязательство» вообще, не глядя на контекст. Проверьте, речь о действии, которое нужно совершить (обязанность), или о правоотношении целиком.",
    "vs": "obligation vs right: obligation — что сторона должна сделать; right — что сторона вправе делать или получать.",
    "task": {
     "q": "Which sentence describes an obligation?",
     "o": [
      "The Tenant may sublet the flat with the Landlord’s consent.",
      "The Tenant must pay the rent on the first day of each month.",
      "The Tenant has the right to a clean flat.",
      "The Tenant could leave early."
     ],
     "a": 1,
     "why": "Must + verb создаёт обязанность. May — разрешение, а right — право; could не создаёт обязанности."
    }
   },
   {
    "t": "right",
    "plain": "Something that a person or organisation is allowed to do or to receive under a contract or the law.",
    "ru": "право (субъективное право)",
    "jx": [
     {
      "j": "INT",
      "t": "В договорах права часто выражены словом may или фразой has the right to: The Buyer may cancel the agreement."
     },
     {
      "j": "US",
      "t": "В американском английском rights также часто означают конституционные или законные права человека (civil rights); в договоре — договорные права сторон."
     }
    ],
    "ex": "The Buyer has the right to inspect the goods.",
    "mistake": "Путать right (право) и remedy (средство защиты нарушенного права). Right — это то, что сторона имеет; remedy — что она может потребовать, если право нарушено.",
    "vs": "right vs remedy: right — само право; remedy — способ защиты, когда право или обязанность нарушены (например, damages).",
    "task": {
     "q": "In the sentence “The Buyer may inspect the goods”, the Buyer has …",
     "o": [
      "a duty to inspect",
      "a prohibition on inspecting",
      "a right (permission) to inspect, but no duty",
      "a remedy for late delivery"
     ],
     "a": 2,
     "why": "May даёт право или разрешение. Покупатель вправе осмотреть товар, но не обязан."
    }
   },
   {
    "t": "legal person (legal entity)",
    "plain": "An organisation, such as a company, that the law treats as having its own rights and duties, separate from the people who run it or own it.",
    "ru": "юридическое лицо",
    "jx": [
     {
      "j": "INT",
      "t": "Natural person — физическое лицо (человек). Legal person или legal entity — организация, которую право признаёт самостоятельным субъектом: она может заключать договоры, владеть имуществом, быть стороной в суде."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе чаще говорят company, a body corporate или corporation; сами формы (Ltd, plc, LLP) устанавливает право Великобритании."
     },
     {
      "j": "US",
      "t": "В США используют corporation, LLC и другие формы по праву штата. Слова Inc., Corp., LLC в названии показывают форму организации."
     },
     {
      "j": "KZ",
      "t": "В казахстанских документах «юридическое лицо» — стандартное понятие. ТОО в английских переводах часто передают как LLP (limited liability partnership), но это переводческая условность: ТОО не совпадает с LLP по праву Великобритании."
     }
    ],
    "ex": "Alpha Trading LLP is a legal person. It signs contracts in its own name.",
    "mistake": "Считать, что форма организации одинакова во всех странах: Ltd, LLC, LLP и ТОО — разные формы разных правовых систем. Поэтому в документе нужно указывать точное название, форму и страну регистрации.",
    "vs": "legal person vs natural person: организация или человек. Company и legal entity в тексте часто используют как близкие по смыслу слова.",
    "task": {
     "q": "Which of these is a legal person?",
     "o": [
      "A registered company",
      "A director of a company, as an individual",
      "A contract",
      "A court order"
     ],
     "a": 0,
     "why": "Legal person — организация, которую право признаёт самостоятельным субъектом (например, зарегистрированная компания). Директор — физическое лицо."
    }
   },
   {
    "t": "remedy",
    "plain": "What the law (or a contract) gives a person when a right is violated or a duty is not performed.",
    "ru": "средство правовой защиты",
    "jx": [
     {
      "j": "INT",
      "t": "Типичные remedies при нарушении договора: damages (денежное возмещение), specific performance (требование реально исполнить), termination (прекращение договора). Какие из них доступны, зависит от права и договора."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе общее правило: damages — основное средство; specific performance — исключительное, в пределах усмотрения суда."
     }
    ],
    "ex": "The Buyer’s remedy for late delivery may be damages or termination, depending on the contract.",
    "mistake": "Считать remedy синонимом right. Remedy возникает после нарушения: нет нарушения — нет необходимости в средстве защиты.",
    "vs": "remedy vs right vs obligation: obligation (должен) → right (вправе) → remedy (может потребовать при нарушении).",
    "task": {
     "q": "The Seller does not deliver. The Buyer asks a court to order the Seller to pay money for the loss. This payment is …",
     "o": [
      "an obligation of the Buyer",
      "a remedy (damages)",
      "a clause",
      "a party"
     ],
     "a": 1,
     "why": "Damages — вид remedy: денежная компенсация за нарушение."
    }
   }
  ],
  "lessons": [
   {
    "id": "1.1",
    "title": "Who is who: parties, rights and duties",
    "ru": "Кто есть кто: стороны, права и обязанности",
    "jur": [
     "INT"
    ],
    "intro": "Короткий текст-образец: найдите стороны, обязанности, сроки и поймите, что значит нарушение договора.",
    "text": {
     "body": [
      "A supplier agrees to deliver goods to a buyer by 30 November. The buyer must pay the agreed price within 15 days after delivery. If the supplier fails to deliver the goods as agreed, the buyer may have a claim for breach of contract."
     ],
     "ru": [
      "Поставщик соглашается поставить товар покупателю до 30 ноября. Покупатель должен оплатить согласованную цену в течение 15 дней после поставки. Если поставщик не поставит товар, как было согласовано, у покупателя может возникнуть требование о нарушении договора."
     ]
    },
    "expr": [
     {
      "en": "agrees to deliver",
      "ru": "соглашается (обязуется) поставить",
      "note": "Agrees to + verb: сторона даёт обещание. Это создаёт обязанность поставить."
     },
     {
      "en": "by 30 November",
      "ru": "не позднее 30 ноября",
      "note": "By = до указанной даты. Включается ли сам день 30 ноября, определяют договор и право."
     },
     {
      "en": "must pay",
      "ru": "должен оплатить",
      "note": "Must выражает обязанность покупателя."
     },
     {
      "en": "within 15 days after delivery",
      "ru": "в течение 15 дней после поставки",
      "note": "Срок идёт от даты фактической поставки, поэтому дата платежа зависит от того, когда товар поставлен. Правила подсчёта дней определяют договор и применимое право."
     },
     {
      "en": "fails to deliver … as agreed",
      "ru": "не поставит так, как согласовано",
      "note": "Fails to = не выполняет. As agreed = на согласованных условиях (срок, количество, качество)."
     },
     {
      "en": "may have a claim",
      "ru": "может иметь требование",
      "note": "May have — только возможность: требование ещё нужно обосновать; результат зависит от договора и права."
     },
     {
      "en": "breach of contract",
      "ru": "нарушение договора",
      "note": "Невыполнение договорной обязанности без законного оправдания."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Identify the parties. Who are the parties in the text?",
      "o": [
       "The buyer and a court",
       "The supplier and the goods",
       "The supplier and the buyer",
       "The supplier, the buyer and a judge"
      ],
      "a": 2,
      "why": "Parties — те, кто заключил договор: supplier (поставщик) и buyer (покупатель). Court появится только если начнётся спор; goods — предмет договора, а не сторона."
     },
     {
      "k": "mcq",
      "q": "Identify each party’s obligations. Which answer is correct?",
      "o": [
       "Supplier: pay the price. Buyer: deliver the goods by 30 November.",
       "Supplier: pay within 15 days. Buyer: deliver by 30 November.",
       "Supplier: deliver the goods by 30 November. Buyer: pay the agreed price within 15 days after delivery.",
       "Both parties: deliver the goods and pay the price."
      ],
      "a": 2,
      "why": "Поставщик обязан поставить товар (agrees to deliver), покупатель обязан заплатить (must pay). Роли нельзя менять местами."
     },
     {
      "k": "mcq",
      "q": "Identify the deadlines. Which statement is correct?",
      "o": [
       "Delivery and payment are both due by 30 November.",
       "Payment is due 15 days before delivery.",
       "There are no deadlines in the text.",
       "Delivery is due by 30 November; payment is due within 15 days after the actual delivery."
      ],
      "a": 3,
      "why": "Срок поставки — до 30 ноября. Срок оплаты считается от даты поставки: within 15 days after delivery. Если товар поставлен 30 ноября, обычно оплатить нужно в пределах следующих 15 дней; точный подсчёт определяют договор и право."
     },
     {
      "k": "open",
      "q": "Explain what breach of contract means in this situation.",
      "model": "A breach of contract is a failure to perform a contractual obligation without a lawful excuse. Here the supplier has promised to deliver by 30 November. If it does not deliver as agreed, it is in breach, and the buyer may have a claim.",
      "why": "Обратите внимание на may have a claim: нарушение даёт покупателю возможные средства защиты (remedies), но какие именно доступны (damages, прекращение договора и др.), зависит от договора и применимого права."
     },
     {
      "k": "mcq",
      "q": "Distinguish an obligation from a right or a remedy. Which item is a remedy?",
      "o": [
       "The supplier’s promise to deliver the goods",
       "The buyer’s claim for damages after non-delivery",
       "The buyer’s promise to pay the price",
       "The buyer’s freedom to choose a different supplier for other goods"
      ],
      "a": 1,
      "why": "Обещание поставить и обещание заплатить — obligations. Свобода выбрать другого поставщика для других товаров — право (freedom). Требование возмещения убытков после нарушения — remedy."
     }
    ],
    "note": "Образец учебного текста. Он не взят из конкретного договора или закона."
   },
   {
    "id": "1.2",
    "title": "Legal persons and organisations",
    "ru": "Юридические лица и организации",
    "jur": [
     "INT",
     "KZ",
     "EW"
    ],
    "intro": "Кто подписывает договор и от чьего имени: человек или компания.",
    "text": {
     "body": [
      "Alpha Trading LLP is a company registered in Kazakhstan. It buys office chairs from Beta Supply Ltd, a company registered in England. Ms Karimova signs the contract as director of Alpha Trading LLP. The contract is between the two companies, not between the companies and Ms Karimova personally."
     ],
     "ru": [
      "Alpha Trading LLP — компания, зарегистрированная в Казахстане. Она покупает офисные кресла у Beta Supply Ltd, компании, зарегистрированной в Англии. Госпожа Каримова подписывает договор как директор Alpha Trading LLP. Договор заключён между двумя компаниями, а не между компаниями и госпожой Каримовой лично."
     ]
    },
    "expr": [
     {
      "en": "registered in",
      "ru": "зарегистрирован(а) в",
      "note": "Название страны регистрации показывает, по какому праву создана организация."
     },
     {
      "en": "signs … as director of",
      "ru": "подписывает в качестве директора",
      "note": "Подпись директора — это подпись компании, если у директора есть полномочия."
     },
     {
      "en": "on behalf of",
      "ru": "от имени",
      "note": "On behalf of X = действуя за X. Договор тогда связывает X, а не подписавшего лично (если нет иного)."
     },
     {
      "en": "natural person / legal person",
      "ru": "физическое лицо / юридическое лицо",
      "note": "Natural person — человек; legal person — организация с самостоятельной правосубъектностью."
     },
     {
      "en": "personally",
      "ru": "лично",
      "note": "Personally liable = лично ответственный. Обычно участники и директора компании не отвечают лично по долгам компании, но исключения зависят от права."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Who are the parties to the contract?",
      "o": [
       "Ms Karimova and Beta Supply Ltd",
       "Ms Karimova and Alpha Trading LLP",
       "Ms Karimova only",
       "Alpha Trading LLP and Beta Supply Ltd"
      ],
      "a": 3,
      "why": "Стороны — две компании. Госпожа Каримова подписывает от имени Alpha Trading LLP."
     },
     {
      "k": "mcq",
      "q": "Is Ms Karimova a party in her personal capacity?",
      "o": [
       "No, she signs on behalf of Alpha Trading LLP",
       "Yes, she is the only party",
       "Yes, together with Beta Supply Ltd",
       "No, because directors can never sign"
      ],
      "a": 0,
      "why": "Text: the contract is between the two companies, not between the companies and Ms Karimova personally."
     },
     {
      "k": "mcq",
      "q": "Which of these is a natural person?",
      "o": [
       "Ms Karimova",
       "Alpha Trading LLP",
       "Beta Supply Ltd",
       "The Supply Agreement"
      ],
      "a": 0,
      "why": "Natural person — человек. Компании — legal persons; договор — документ."
     },
     {
      "k": "open",
      "q": "Explain the difference between a natural person and a legal person.",
      "model": "A natural person is a human being. A legal person is an organisation, such as a company, that the law treats as having its own rights and duties, separate from the people who run it or own it.",
      "why": "Это ключевая идея: договор компании связывает компанию. Исключения (когда отвечает лично директор или участник) зависят от права и фактов; в этом уроке они не разбираются."
     }
    ],
    "note": "В английских переводах казахстанское ТОО часто называют LLP. Это переводческая условность: LLP по праву Великобритании — другая организационно-правовая форма."
   },
   {
    "id": "1.3",
    "title": "Obligations and permissions: must, shall, may, can",
    "ru": "Обязанности и разрешения: must, shall, may, can",
    "jur": [
     "INT"
    ],
    "intro": "Как модальные глаголы показывают обязанность, разрешение и запрет.",
    "text": {
     "body": [
      "1. A member must show a valid card at the entrance.",
      "2. A member may bring one guest each month.",
      "3. A member must not use the gym after 22:00.",
      "4. The club shall give 14 days’ notice of any change to the fees.",
      "5. The club can offer new classes, but it does not have to."
     ],
     "ru": [
      "1. Член клуба должен предъявлять действующую карту на входе.",
      "2. Член клуба вправе приводить одного гостя в месяц.",
      "3. Член клуба не должен пользоваться залом после 22:00.",
      "4. Клуб обязан уведомлять о любом изменении цен за 14 дней.",
      "5. Клуб может предлагать новые занятия, но не обязан."
     ]
    },
    "expr": [
     {
      "en": "must",
      "ru": "должен",
      "note": "Обязанность. Часто используется в современном ясном стиле (plain English)."
     },
     {
      "en": "shall",
      "ru": "обязан (в традиционном стиле)",
      "note": "Shall + verb обычно создаёт обязанность. В современных договорах многие юристы предпочитают must, потому что shall часто используют непоследовательно; но shall остаётся частым в традиционных договорах и в некоторых законах."
     },
     {
      "en": "may",
      "ru": "вправе, может (разрешение)",
      "note": "May даёт право или разрешение: сторона может действовать, но не обязана."
     },
     {
      "en": "must not / shall not",
      "ru": "не должен; запрещено",
      "note": "Запрет. Лучше писать must not: may not иногда читается двояко (нет разрешения или запрет?)."
     },
     {
      "en": "can",
      "ru": "может (способность или возможность)",
      "note": "В формальном договоре для разрешения обычно предпочитают may: can чаще выражает способность или неформальную возможность."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Which sentence is an obligation of the club?",
      "o": [
       "Sentence 2",
       "Sentence 4",
       "Sentence 3",
       "Sentence 5"
      ],
      "a": 1,
      "why": "Sentence 4: The club shall give 14 days’ notice — обязанность клуба. Sentence 5 (can offer) — возможность, не обязанность."
     },
     {
      "k": "mcq",
      "q": "Which sentence is a prohibition?",
      "o": [
       "Sentence 1",
       "Sentence 2",
       "Sentence 3",
       "Sentence 4"
      ],
      "a": 2,
      "why": "Must not = запрет. Sentence 1 — обязанность, sentence 2 — разрешение."
     },
     {
      "k": "mcq",
      "q": "Does a member have to bring a guest?",
      "o": [
       "No: sentence 2 uses may, so bringing a guest is a permission, not a duty.",
       "Yes, every month",
       "Yes, but only after 22:00",
       "No, because guests are prohibited"
      ],
      "a": 0,
      "why": "May = можно, но необязательно."
     },
     {
      "k": "mcq",
      "q": "In a formal contract, which verb is usually preferred to express permission?",
      "o": [
       "can",
       "will",
       "may",
       "should"
      ],
      "a": 2,
      "why": "May обычно предпочитают для разрешения. Can чаще означает способность; will и should не создают чёткого разрешения."
     },
     {
      "k": "open",
      "q": "Rewrite “The Tenant may not keep animals” so that it is clearly a prohibition.",
      "model": "The Tenant must not keep animals in the flat.",
      "why": "May not может читаться двояко. Must not (или shall not) однозначно выражает запрет."
     }
    ],
    "note": "Учебный текст. Правила клубов и договоров зависят от конкретных условий и права."
   },
   {
    "id": "1.4",
    "title": "Conditions and deadlines",
    "ru": "Условия и сроки",
    "jur": [
     "INT"
    ],
    "intro": "Как if, unless, provided that и предлоги by, within, after задают условия и сроки.",
    "text": {
     "body": [
      "1. The Customer must pay each invoice within 14 days after receiving it.",
      "2. If the Customer pays late, the Supplier may charge interest.",
      "3. Unless the Supplier receives payment in full by 30 November, the Supplier may suspend the service.",
      "4. The Supplier may end the contract, provided that it gives the Customer written notice."
     ],
     "ru": [
      "1. Заказчик должен оплачивать каждый счёт в течение 14 дней после его получения.",
      "2. Если заказчик платит с опозданием, поставщик вправе начислять проценты.",
      "3. Если поставщик не получит полную оплату до 30 ноября, он вправе приостановить услугу.",
      "4. Поставщик вправе прекратить договор при условии, что направит заказчику письменное уведомление."
     ]
    },
    "expr": [
     {
      "en": "within 14 days after receiving",
      "ru": "в течение 14 дней после получения",
      "note": "Срок начинается с события (получение счёта), а не с даты счёта."
     },
     {
      "en": "by 30 November",
      "ru": "не позднее 30 ноября",
      "note": "By задаёт крайнюю дату."
     },
     {
      "en": "if",
      "ru": "если",
      "note": "Условие: действие возможно, когда условие выполнено."
     },
     {
      "en": "unless",
      "ru": "если не; пока не",
      "note": "Unless = if not: исключение из правила."
     },
     {
      "en": "provided that",
      "ru": "при условии, что",
      "note": "Вводит обязательное условие, без которого право не возникает."
     },
     {
      "en": "business day / calendar day",
      "ru": "рабочий день / календарный день",
      "note": "В договорах часто указано, какие дни считаются. Если не указано, подсчёт определяет применимое право."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "What starts the 14-day payment period in sentence 1?",
      "o": [
       "The Customer’s receipt of the invoice",
       "The date of the contract",
       "The date of the Supplier’s last delivery",
       "30 November"
      ],
      "a": 0,
      "why": "Within 14 days after receiving it: период начинается с получения счёта."
     },
     {
      "k": "mcq",
      "q": "In sentence 3, “unless” means almost the same as …",
      "o": [
       "if … also",
       "whenever",
       "if … not",
       "because"
      ],
      "a": 2,
      "why": "Unless the Supplier receives payment = If the Supplier does not receive payment."
     },
     {
      "k": "mcq",
      "q": "When may the Supplier end the contract (sentence 4)?",
      "o": [
       "If it gives the Customer written notice",
       "Whenever it wants, without notice",
       "Only if the Customer pays late",
       "Never"
      ],
      "a": 0,
      "why": "Provided that = при условии, что. Условие — письменное уведомление."
     },
     {
      "k": "open",
      "q": "Rewrite sentence 3 using “if”.",
      "model": "If the Supplier does not receive payment in full by 30 November, the Supplier may suspend the service.",
      "why": "Unless X = if not X. Обе формулировки означают одно и то же, но unless компактнее."
     }
    ],
    "note": "Учебный текст. Правила подсчёта сроков зависят от договора и права."
   },
   {
    "id": "1.5",
    "title": "Simple legal documents",
    "ru": "Простые юридические документы",
    "jur": [
     "INT"
    ],
    "intro": "Из каких частей состоит короткое официальное уведомление.",
    "text": {
     "body": [
      "NOTICE OF LATE DELIVERY",
      "Date: 2 December",
      "To: Beta Supply Ltd",
      "From: Alpha Trading LLP",
      "Reference: Purchase Order No. 17",
      "We refer to Purchase Order No. 17. Delivery was due by 30 November. The goods have not been delivered.",
      "Please deliver the goods by 9 December or tell us the new delivery date.",
      "We reserve our rights under the contract."
     ],
     "ru": [
      "УВЕДОМЛЕНИЕ О ПРОСРОЧКЕ ПОСТАВКИ",
      "Дата: 2 декабря",
      "Кому: Beta Supply Ltd",
      "От: Alpha Trading LLP",
      "Ссылка: заказ на закупку № 17",
      "Ссылаемся на заказ на закупку № 17. Поставка должна была состояться до 30 ноября. Товар не поставлен.",
      "Просим поставить товар до 9 декабря или сообщить новую дату поставки.",
      "Мы сохраняем за собой права по договору."
     ]
    },
    "expr": [
     {
      "en": "We refer to …",
      "ru": "Ссылаемся на …",
      "note": "Формальное указание на предыдущий документ."
     },
     {
      "en": "was due by",
      "ru": "должна была состояться до",
      "note": "Due = срок наступил. Was due by 30 November: срок был до 30 ноября."
     },
     {
      "en": "Please deliver … by 9 December",
      "ru": "Просим поставить … до 9 декабря",
      "note": "Вежливая просьба с точной датой."
     },
     {
      "en": "We reserve our rights",
      "ru": "Сохраняем за собой права",
      "note": "Отправитель не отказывается от своих прав (например, потребовать возмещение позже). Это не угроза и не принятие позиции другой стороны."
     },
     {
      "en": "Reference",
      "ru": "ссылка, номер дела или документа",
      "note": "Помогает точно идентифицировать документ."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "What is the main purpose of this notice?",
      "o": [
       "To tell the supplier that delivery is late and to ask for delivery or a new date",
       "To cancel the purchase order",
       "To pay the invoice",
       "To invite the supplier to a meeting"
      ],
      "a": 0,
      "why": "Уведомление сообщает о просрочке и просит поставить товар до даты или назвать новую дату."
     },
     {
      "k": "mcq",
      "q": "Which line identifies the earlier document?",
      "o": [
       "Date: 2 December",
       "From: Alpha Trading LLP",
       "Reference: Purchase Order No. 17",
       "Please deliver the goods"
      ],
      "a": 2,
      "why": "Reference указывает документ, к которому относится уведомление."
     },
     {
      "k": "mcq",
      "q": "What does “We reserve our rights” mean?",
      "o": [
       "The sender cancels the contract immediately",
       "The sender accepts the late delivery without conditions",
       "The sender does not give up its rights and may use them later",
       "The sender will pay damages"
      ],
      "a": 2,
      "why": "Reserve rights = сохранить права на будущее. Автоматически ничего не прекращается и не принимается."
     }
    ],
    "note": "Образец учебного документа с выдуманными названиями."
   }
  ]
 },
 {
  "id": 2,
  "ready": true,
  "title": "Contract Language",
  "ru": "Язык договоров",
  "cefr": "ориентир: примерно B1–B2 (проектная модель LAWSTART, не сертификация CEFR)",
  "summary": "Структура договора, определения, заверения и гарантии, оплата и поставка, нарушение, ответственность, прекращение, применимое право.",
  "goals": [
   {
    "en": "Describe the main parts of a contract and what each part does.",
    "ru": "Описывать основные части договора и их роль."
   },
   {
    "en": "Understand common clauses: termination, indemnity, force majeure, amendment, governing law.",
    "ru": "Понимать типовые пункты: прекращение, возмещение (indemnity), форс-мажор, изменения, применимое право."
   },
   {
    "en": "Identify the rights and obligations of each party in a short provision.",
    "ru": "Находить права и обязанности сторон в коротком положении."
   },
   {
    "en": "Read and interpret short contract provisions in plain English.",
    "ru": "Читать и объяснять короткие положения договора."
   }
  ],
  "concepts": [
   {
    "h": "The structure of a contract",
    "en": "Contracts differ, but many follow a similar order: (1) title; (2) date and parties; (3) background or recitals (often introduced by “Whereas”); (4) definitions; (5) the main obligations of each party, including price and payment; (6) term and termination; (7) liability, warranties and indemnities; (8) force majeure; (9) notices, amendment and entire agreement; (10) governing law and dispute resolution; (11) signatures."
   },
   {
    "h": "Termination, amendment, notices",
    "en": "Termination clauses say how and when a party may end the contract, for example by giving written notice. An amendment is a change to the contract; many contracts say that an amendment is valid only if it is in writing and signed by both parties. A notice clause explains how formal messages must be sent (for example, in writing to an address)."
   },
   {
    "h": "Indemnity, warranty, force majeure",
    "en": "To indemnify means to compensate another party for a loss or cost, in the situations the contract describes. A warranty is a promise that a fact is true or that something meets a stated standard. Force majeure describes events outside the parties’ control (for example, a natural disaster); the clause says what happens to the parties’ obligations if such an event occurs. In many legal systems, force majeure helps only as far as the contract or the applicable law provides."
   },
   {
    "h": "Governing law and jurisdiction",
    "en": "A governing law clause says which country’s law is used to interpret the contract, for example “the laws of England and Wales”. A jurisdiction clause says which court (or arbitration) will decide disputes. These are two different questions. The words and ideas in this lesson are general: contract law varies between jurisdictions, for example common-law systems and civil-law systems."
   },
   {
    "h": "Definitions and interpretation",
    "en": "A definitions clause explains the meaning of key words, often written with capital letters (for example, “Goods” or “Delivery Date”). An interpretation clause says how to read the contract: for example, that headings do not change the meaning and that a list after “including” gives examples, not a complete list."
   },
   {
    "h": "Representations and warranties",
    "en": "A representation is a statement of fact made to persuade another party to enter the contract. A warranty is a contractual promise that a statement is true or that something meets a stated standard. In international deals the words are often used together. The legal consequences of an untrue statement depend on the contract and on the applicable law."
   },
   {
    "h": "Payment and delivery obligations",
    "en": "Contracts usually say what must be paid, in which currency, when and after which event (for example, “within 14 days after receipt of a valid invoice”). They also say what must be delivered, where, by when, and when the risk of loss passes from one party to the other."
   },
   {
    "h": "Breach, liability and damages",
    "en": "A breach is a failure to perform a contractual obligation without a lawful excuse. The usual remedies include damages, termination and, in some cases, an order to perform. Contracts often limit liability, for example by a cap on the total amount. Whether such limits are valid depends on the applicable law."
   }
  ],
  "vocab": [
   {
    "t": "governing law",
    "ru": "применимое право",
    "def": "the law that applies to a contract and decides how it is interpreted",
    "ex": "The governing law of this Agreement is the law of England and Wales."
   },
   {
    "t": "jurisdiction",
    "ru": "юрисдикция",
    "def": "the power of a court to decide a case; also, a country or state with its own legal system",
    "ex": "The courts of Paris have jurisdiction over any dispute."
   },
   {
    "t": "terminate",
    "ru": "прекращать (договор)",
    "def": "to end a contract before or at the end of its term",
    "ex": "Either party may terminate the Agreement by giving written notice."
   },
   {
    "t": "indemnify",
    "ru": "возмещать убытки",
    "def": "to compensate another person for loss or cost, as the contract provides",
    "ex": "The Supplier shall indemnify the Customer against losses caused by the Supplier’s breach."
   },
   {
    "t": "amendment",
    "ru": "изменение, поправка",
    "def": "a change to the terms of a contract or law",
    "ex": "Any amendment must be in writing."
   },
   {
    "t": "force majeure",
    "ru": "обстоятельства непреодолимой силы",
    "def": "an event outside the parties’ control that may excuse them from performing, if the contract or the law says so",
    "ex": "A flood is an example of a force majeure event."
   },
   {
    "t": "warranty",
    "ru": "гарантия, заверение",
    "def": "a promise that a statement is true or that something meets a stated standard",
    "ex": "The Seller gives a warranty that the goods are new."
   },
   {
    "t": "consideration",
    "ru": "встречное предоставление (в общем праве)",
    "def": "in common-law systems, something of value that each party gives in exchange for the other’s promise",
    "ex": "The price is the Buyer’s consideration for the goods."
   },
   {
    "t": "assign",
    "ru": "уступать (права)",
    "def": "to transfer a right to another person",
    "ex": "The Supplier may not assign its rights without the Customer’s consent."
   },
   {
    "t": "waive",
    "ru": "отказываться (от права)",
    "def": "to give up a right voluntarily",
    "ex": "A party that does not complain does not automatically waive its rights."
   },
   {
    "t": "notice",
    "ru": "уведомление",
    "def": "a formal message sent to the other party under the contract",
    "ex": "Notice must be sent in writing to the address in clause 12."
   },
   {
    "t": "entire agreement",
    "ru": "полнота соглашения",
    "def": "a clause saying that the written contract contains the whole agreement of the parties",
    "ex": "The entire agreement clause excludes earlier promises that are not written in the contract."
   }
  ],
  "texts": [
   {
    "title": "Provision 1: Termination (original example)",
    "body": [
     "12.1 Either party may terminate this Agreement by giving thirty (30) days’ written notice to the other party.",
     "12.2 Either party may terminate this Agreement immediately by written notice if the other party commits a material breach and does not remedy it within fourteen (14) days after receiving written notice of the breach."
    ],
    "note": "General example. Notice periods and the effect of termination depend on the contract and the applicable law.",
    "qs": [
     {
      "q": "Who may terminate under clause 12.1?",
      "o": [
       "Only the first party named",
       "Either party",
       "Only a court",
       "Neither party"
      ],
      "a": 1,
      "why": "“Either party may terminate” gives both parties the right."
     },
     {
      "q": "How much notice does clause 12.1 require?",
      "o": [
       "Fourteen days",
       "Immediate",
       "Thirty days, in writing",
       "Ninety days, orally"
      ],
      "a": 2,
      "why": "“thirty (30) days’ written notice”."
     },
     {
      "q": "When may a party terminate immediately under clause 12.2?",
      "o": [
       "Whenever it wishes",
       "If the other party commits a material breach and does not fix it within 14 days of notice",
       "After one day of delay",
       "Only after a court order"
      ],
      "a": 1,
      "why": "Immediate termination needs a material breach plus failure to remedy it within 14 days after written notice."
     }
    ]
   },
   {
    "title": "Provision 2: Amendment and governing law (original example)",
    "body": [
     "15.1 No amendment to this Agreement is effective unless it is in writing and signed by both parties.",
     "15.2 This Agreement and any dispute arising out of it shall be governed by the laws of England and Wales.",
     "15.3 The courts of England and Wales shall have exclusive jurisdiction."
    ],
    "note": "Example uses the law of England and Wales for illustration only; it is not a recommendation to choose that law.",
    "qs": [
     {
      "q": "Is a change agreed only by telephone effective under clause 15.1?",
      "o": [
       "Yes",
       "No, it must be in writing and signed by both parties",
       "Yes, if one party agrees",
       "Yes, after 30 days"
      ],
      "a": 1,
      "why": "15.1 requires writing and signatures of both parties."
     },
     {
      "q": "Which law governs the Agreement?",
      "o": [
       "The law of England and Wales",
       "The law of any country the Buyer chooses",
       "No law",
       "International custom only"
      ],
      "a": 0,
      "why": "Clause 15.2 names the law of England and Wales."
     },
     {
      "q": "What does clause 15.3 decide?",
      "o": [
       "The price",
       "Which courts decide disputes",
       "The date of delivery",
       "Who signs first"
      ],
      "a": 1,
      "why": "Jurisdiction = which courts. It is different from governing law."
     }
    ]
   }
  ],
  "speak": {
   "phrases": [
    {
     "en": "Either party may terminate this Agreement by giving thirty days’ written notice.",
     "ru": "Любая сторона может расторгнуть договор, направив письменное уведомление за 30 дней."
    },
    {
     "en": "The Supplier shall indemnify the Customer against any loss caused by its breach.",
     "ru": "Поставщик возместит заказчику убытки, вызванные его нарушением."
    },
    {
     "en": "No amendment is effective unless it is in writing and signed by both parties.",
     "ru": "Изменения действительны только в письменной форме с подписями обеих сторон."
    },
    {
     "en": "This Agreement is governed by the laws of England and Wales.",
     "ru": "К договору применяется право Англии и Уэльса."
    }
   ],
   "dialogue": {
    "title": "Dialogue: reviewing a clause with a colleague",
    "lines": [
     {
      "who": "Junior lawyer",
      "en": "Could you help me with clause twelve? I am not sure about the notice period."
     },
     {
      "who": "Colleague",
      "en": "Of course. Either party may terminate by giving thirty days’ written notice."
     },
     {
      "who": "Junior lawyer",
      "en": "So an email is not enough if the contract requires written notice by post?"
     },
     {
      "who": "Colleague",
      "en": "That depends on the notice clause. Please check how notices must be sent."
     },
     {
      "who": "Junior lawyer",
      "en": "And what happens if there is a force majeure event?"
     },
     {
      "who": "Colleague",
      "en": "The force majeure clause should say. It usually explains which obligations are suspended."
     }
    ]
   },
   "prompts": [
    {
     "q": "Explain the difference between governing law and jurisdiction.",
     "model": "Governing law is the law used to interpret the contract. Jurisdiction means which court or tribunal decides the disputes."
    },
    {
     "q": "Explain what “indemnify” means, using an example.",
     "model": "To indemnify means to compensate another party for a loss. For example, the supplier indemnifies the customer if the supplier’s breach causes the customer a loss."
    }
   ]
  },
  "test": [
   {
    "q": "Which part of a contract usually appears first?",
    "o": [
     "The signature block",
     "The termination clause",
     "The notices clause",
     "The title and the description of the parties"
    ],
    "a": 3,
    "why": "Contracts normally start with the title, the date and the parties. Signatures are at the end."
   },
   {
    "q": "A governing law clause says …",
    "o": [
     "which party wins any dispute",
     "which country’s or state’s law applies to the contract",
     "the date of signature",
     "the price of the goods"
    ],
    "a": 1,
    "why": "Governing law = применимое право."
   },
   {
    "q": "To “terminate” a contract means to …",
    "o": [
     "extend it",
     "translate it",
     "end it",
     "sign it"
    ],
    "a": 2,
    "why": "Terminate = прекратить договор."
   },
   {
    "q": "To “indemnify” someone means to …",
    "o": [
     "compensate them for a loss as the contract provides",
     "inspect their goods",
     "delay a payment",
     "witness their signature"
    ],
    "a": 0,
    "why": "Indemnify = возместить убытки (в случаях, описанных договором)."
   },
   {
    "q": "An “amendment” is …",
    "o": [
     "a complaint to a court",
     "a final payment",
     "a court order",
     "a change to the terms of the contract"
    ],
    "a": 3,
    "why": "Amendment = изменение условий."
   },
   {
    "q": "“Force majeure” refers to …",
    "o": [
     "a deliberate breach of contract",
     "an event outside the parties’ control that may excuse performance if the contract or law says so",
     "a type of payment",
     "a lawyer’s fee"
    ],
    "a": 1,
    "why": "Force majeure = обстоятельства непреодолимой силы; effect depends on the contract and applicable law."
   },
   {
    "q": "Text: “Either party may terminate this Agreement by giving thirty (30) days’ written notice.” Who may terminate?",
    "o": [
     "Only the Supplier",
     "Only with a court’s permission",
     "Either party",
     "Only the party that signed first"
    ],
    "a": 2,
    "why": "“Either party” = любая из сторон."
   },
   {
    "q": "Text: “No amendment is effective unless it is in writing and signed by both parties.” A change agreed only by telephone is …",
    "o": [
     "effective",
     "not effective under this clause",
     "effective after 30 days",
     "effective if one party agrees"
    ],
    "a": 1,
    "why": "The clause requires writing and signatures of both parties."
   },
   {
    "q": "To “waive” a right means to …",
    "o": [
     "transfer it to someone else",
     "use it immediately",
     "give it up voluntarily",
     "ask a court to enforce it"
    ],
    "a": 2,
    "why": "Waive = отказаться от права. Transfer is assign."
   },
   {
    "q": "Text: “The Supplier shall indemnify the Customer against any loss arising from the Supplier’s breach.” Who compensates whom?",
    "o": [
     "The Customer compensates the Supplier",
     "The Supplier compensates the Customer",
     "A court compensates both",
     "Nobody compensates anybody"
    ],
    "a": 1,
    "why": "The Supplier indemnifies = the Supplier compensates the Customer."
   },
   {
    "q": "“The Agreement was executed on 1 March and takes effect on 1 April.” This means that …",
    "o": [
     "it was cancelled on 1 April",
     "it was signed and completed on 1 March, and its terms apply from 1 April",
     "it was performed in full on 1 March",
     "it takes effect before it is signed"
    ],
    "a": 1,
    "why": "Execution и effective date — разные моменты. Подписание не всегда совпадает со вступлением в силу."
   },
   {
    "q": "Which clause decides which law applies to the contract?",
    "o": [
     "The notices clause",
     "The governing law clause",
     "The jurisdiction clause",
     "The definitions clause"
    ],
    "a": 1,
    "why": "Governing law выбирает право. Jurisdiction выбирает суд."
   }
  ],
  "rev": 2,
  "topics": [
   "contract structure",
   "definitions and interpretation",
   "representations and warranties",
   "payment and delivery obligations",
   "breach of contract",
   "liability and damages",
   "termination",
   "governing law and dispute resolution"
  ],
  "terms": [
   {
    "t": "consideration",
    "plain": "Something of value that each party gives or promises in exchange for the other party’s promise. In common-law systems a simple contract generally needs consideration to be enforceable.",
    "ru": "встречное предоставление (в общем праве)",
    "jx": [
     {
      "j": "US",
      "t": "В праве США consideration — традиционное требование к договору: обещание должно быть частью обмена (bargained-for exchange). Детали зависят от права штата и вида договора."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе consideration — тоже основа обычного (simple) договора: это обещание, действие или воздержание от действия, имеющее ценность. Для договора в форме deed (особый документ с формальностями) consideration, как правило, не требуется. Как общее правило, «прошлое» consideration (то, что уже сделано до обещания) недостаточно."
     },
     {
      "j": "KZ",
      "t": "В казахстанском гражданском праве доктрины consideration в таком виде нет: договор строится на соглашении сторон, а различают, например, возмездные и безвозмездные договоры. Поэтому «consideration» нельзя автоматически переводить как «оплата» или «встречное исполнение» без проверки контекста."
     }
    ],
    "ex": "The Buyer’s promise to pay the price is the consideration for the Seller’s promise to deliver the goods.",
    "mistake": "Думать, что consideration = деньги. Это может быть любое обещание, действие или воздержание от действия, имеющее ценность.",
    "vs": "consideration (что даётся взамен обещания) отличается от payment (оплата) и от compensation (возмещение вреда).",
    "task": {
     "q": "Which statement best describes consideration in a common-law contract?",
     "o": [
      "Only the price in money",
      "A signature on the contract",
      "A court’s decision on damages",
      "Something of value given or promised in exchange for the other party’s promise"
     ],
     "a": 3,
     "why": "Consideration — ценность, обмениваемая на обещание; это не обязательно деньги. Подпись и решение суда к consideration не относятся."
    }
   },
   {
    "t": "liability",
    "plain": "Legal responsibility, especially a duty to pay for loss or harm. A party that is liable may have to pay or to put things right.",
    "ru": "юридическая ответственность",
    "jx": [
     {
      "j": "INT",
      "t": "В договорах часто встречаются limitation of liability (ограничение ответственности, например потолок суммы) и exclusion of liability (исключение ответственности). Действительны ли такие пункты и в каких пределах, определяет применимое право, а не только текст договора."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе законодательство ограничивает возможность исключить или ограничить ответственность в ряде случаев (например, за некоторые виды вреда или в потребительских договорах)."
     },
     {
      "j": "US",
      "t": "В США пределы ограничения ответственности зависят от права штата и вида договора."
     },
     {
      "j": "KZ",
      "t": "В русском языке «ответственность» шире: бывает гражданско-правовая, административная, уголовная. В договорной лексике liability обычно относится к гражданско-правовой ответственности."
     }
    ],
    "ex": "The Supplier’s total liability under this Agreement shall not exceed the price paid by the Customer.",
    "mistake": "Переводить liability как responsibility. Responsibility часто означает обязанность или сферу ведения (She is responsible for the budget), а liability — юридическую ответственность за убыток.",
    "vs": "liability vs obligation: obligation — что нужно сделать; liability — отвечать за последствия, если не сделал или причинил вред.",
    "task": {
     "q": "“The Supplier’s liability is limited to the price paid.” This means …",
     "o": [
      "the Supplier has no obligations",
      "the Customer must pay the price twice",
      "the contract is terminated",
      "the Supplier’s legal responsibility for loss is capped at that amount, if the clause is valid under the applicable law"
     ],
     "a": 3,
     "why": "Limitation of liability ограничивает сумму ответственности (cap). Но её действительность зависит от права."
    }
   },
   {
    "t": "damages",
    "plain": "Money that a court orders one party to pay to another to compensate for loss caused by a breach of contract or a wrong. “Damages” (plural) is the money; “damage” (singular) is harm.",
    "ru": "возмещение убытков (денежная компенсация, присуждаемая судом)",
    "jx": [
     {
      "j": "INT",
      "t": "Damages — основное денежное средство защиты (remedy) при нарушении договора в общем праве. Цель обычно — поставить пострадавшую сторону в положение, в котором она была бы при надлежащем исполнении. Правила о предсказуемости убытков (remoteness), обязанности смягчать их (mitigation) и пределах зависят от права."
     },
     {
      "j": "US",
      "t": "В США существуют разные виды damages (compensatory, punitive и др.); их доступность зависит от права штата и вида спора."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе damages по договору в основном компенсационные; штрафные damages по общему правилу не присуждаются за нарушение договора."
     },
     {
      "j": "KZ",
      "t": "В казахстанском праве используется понятие «убытки» (реальный ущерб и упущенная выгода). Это не точный эквивалент damages: сравнивайте по содержанию нормы."
     }
    ],
    "ex": "The court awarded the Buyer damages for the Seller’s failure to deliver.",
    "mistake": "Писать damage вместо damages. Damage — вред или повреждение (the damage to the goods); damages — деньги по решению суда (the court awarded damages).",
    "vs": "damages vs indemnity: damages — средство защиты по праву, которое нужно обосновать; indemnity — договорное обещание возместить указанные потери. Они близки, но не тождественны.",
    "task": {
     "q": "Which sentence is correct?",
     "o": [
      "The court awarded the Buyer damages of £5,000.",
      "The court awarded the Buyer a damage of £5,000.",
      "The court damaged the Buyer £5,000.",
      "The court awarded the Buyer the damaging."
     ],
     "a": 0,
     "why": "Damages (plural, без артикля) — деньги, присуждённые судом. Damage — вред."
    }
   },
   {
    "t": "indemnify / indemnity",
    "plain": "To indemnify is to promise to compensate someone for a specific loss or cost. An indemnity is the promise (or the clause) itself.",
    "ru": "возмещать убытки по договору; договорное обязательство возместить (indemnity)",
    "jx": [
     {
      "j": "INT",
      "t": "Indemnity — договорное обязательство: одна сторона возмещает другой указанные потери, например из-за претензий третьих лиц. Объём, условия и исполнимость зависят от формулировки и применимого права."
     },
     {
      "j": "US",
      "t": "В США толкование и допустимые пределы indemnity зависят от права штата; в ряде штатов есть ограничения в отдельных сферах (например, в строительстве)."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе indemnity толкуется по тексту; у такого условия могут быть правила, отличающиеся от правил о damages. Проверяйте формулировку."
     },
     {
      "j": "KZ",
      "t": "Прямого однозначного аналога может не быть; близкие понятия — возмещение убытков, неустойка, поручительство и гарантия. Переводить нужно по содержанию условия."
     }
    ],
    "ex": "The Supplier shall indemnify the Customer against all losses arising from third-party claims that the goods infringe intellectual property rights.",
    "mistake": "Считать, что indemnity автоматически покрывает любой убыток. Покрываются только потери, описанные в пункте, на указанных условиях. Не путать indemnify с insure (страховать) и guarantee (гарантировать).",
    "vs": "indemnity vs damages vs guarantee: indemnity — обещание возместить потери; damages — деньги за нарушение; guarantee — обычно обязательство отвечать за исполнение чужого обязательства.",
    "task": {
     "q": "“The Supplier shall indemnify the Customer against losses caused by third-party claims.” What must the Supplier do?",
     "o": [
      "Insure the goods",
      "Sue the Customer",
      "Terminate the agreement",
      "Compensate the Customer for those losses, as the clause provides"
     ],
     "a": 3,
     "why": "Indemnify = возместить убытки в случаях, описанных договором. Это не страхование и не расторжение."
    }
   },
   {
    "t": "governing law",
    "plain": "The law of a country or state that applies to a contract and decides how it is interpreted and enforced.",
    "ru": "применимое право",
    "jx": [
     {
      "j": "INT",
      "t": "Governing law clause выбирает право, а не суд. В международных договорах стороны часто выбирают право определённой страны или штата, но свобода выбора ограничена императивными нормами и правилами международного частного права."
     },
     {
      "j": "US",
      "t": "В США выбирают право конкретного штата (например, New York) или федеральное право там, где оно применимо."
     },
     {
      "j": "EW",
      "t": "Формула the laws of England and Wales означает право Англии и Уэльса; Шотландия и Северная Ирландия — отдельные правовые системы."
     },
     {
      "j": "KZ",
      "t": "В трансграничных договорах стороны во многих случаях вправе выбрать применимое право по правилам международного частного права Казахстана, с учётом императивных норм. Актуальные условия проверяйте по закону."
     }
    ],
    "ex": "This Agreement is governed by the laws of England and Wales.",
    "mistake": "Думать, что выбор права = выбор суда. Можно выбрать право Англии и Уэльса, а споры передать в арбитраж в другой стране. Governing law и jurisdiction (или arbitration) — разные вопросы.",
    "vs": "governing law vs jurisdiction vs seat of arbitration: право, суд (или арбитраж) и юридическое место арбитража.",
    "task": {
     "q": "A contract says: “This Agreement is governed by English law.” What does this clause decide?",
     "o": [
      "Which court hears disputes",
      "Where the goods must be delivered",
      "Which law applies to the contract",
      "Who signs first"
     ],
     "a": 2,
     "why": "Governing law = применимое право. Суд определяет отдельный пункт (jurisdiction или arbitration)."
    }
   },
   {
    "t": "jurisdiction",
    "plain": "(1) The power of a court to decide a case. (2) A country, state or territory with its own legal system (“in this jurisdiction”).",
    "ru": "юрисдикция; подсудность; правовая система государства или штата",
    "jx": [
     {
      "j": "INT",
      "t": "Jurisdiction clause указывает, какие суды рассматривают споры. Exclusive jurisdiction — только эти суды; non-exclusive — эти суды могут рассматривать спор, но другие суды не исключены. Арбитражная оговорка — отдельный механизм (частный трибунал, не государственный суд)."
     },
     {
      "j": "US",
      "t": "В США различают суды штатов и федеральные суды; есть также понятие personal jurisdiction (власть суда над ответчиком)."
     },
     {
      "j": "EW",
      "t": "The courts of England and Wales — суды Англии и Уэльса."
     },
     {
      "j": "KZ",
      "t": "В русскоязычной практике рядом стоят «юрисдикция», «подсудность» и «подведомственность»; выбирайте перевод по контексту."
     }
    ],
    "ex": "The courts of England and Wales shall have exclusive jurisdiction over any dispute arising out of this Agreement.",
    "mistake": "Переводить любое jurisdiction как «юрисдикция». Иногда это «подсудность» (какой суд), иногда «страна или штат».",
    "vs": "jurisdiction (суд) vs governing law (право) vs arbitration (частный трибунал).",
    "task": {
     "q": "An “exclusive jurisdiction” clause means that …",
     "o": [
      "only an arbitrator may hear disputes",
      "only the named courts may hear disputes under the contract",
      "disputes can never go to court",
      "the contract can be changed without notice"
     ],
     "a": 1,
     "why": "Exclusive = только названные суды. Non-exclusive оставляет возможность и другим судам."
    }
   },
   {
    "t": "force majeure",
    "plain": "An extraordinary event outside the parties’ control (for example a natural disaster or war) that a contract or the law may treat as an excuse for not performing, or for delay.",
    "ru": "обстоятельства непреодолимой силы (форс-мажор)",
    "jx": [
     {
      "j": "EW",
      "t": "В Англии и Уэльсе нет общей доктрины force majeure: она действует через пункт договора, и формулировка пункта толкуется строго. Если пункта нет, возможна доктрина frustration (очень высокий порог): при ней договор прекращается автоматически."
     },
     {
      "j": "US",
      "t": "В США зависит от пункта договора и права штата; кроме того, существуют доктрины невозможности и непрактичности исполнения, применение которых ограничено."
     },
     {
      "j": "KZ",
      "t": "В казахстанском праве понятие непреодолимой силы закреплено в законе: по общему правилу сторона может быть освобождена от ответственности, если докажет, что надлежащее исполнение оказалось невозможным из-за непреодолимой силы; стороны могут предусмотреть в договоре иные последствия. Актуальную формулировку нормы и требования к подтверждению проверяйте по тексту закона."
     },
     {
      "j": "INT",
      "t": "Что именно произойдёт (приостановление обязательств, освобождение от ответственности, право расторгнуть договор) зависит от пункта договора и применимого права. Обычно нужно письменное уведомление и принятие разумных мер для уменьшения последствий."
     }
    ],
    "ex": "Neither party is liable for delay caused by a Force Majeure Event, provided that it gives prompt written notice and takes reasonable steps to reduce the effect.",
    "mistake": "Считать, что форс-мажор автоматически прекращает договор или снимает все обязанности. Обычно это приостановление или освобождение от ответственности при соблюдении условий. Не всякое неблагоприятное событие (например, рост цен) — форс-мажор.",
    "vs": "force majeure vs frustration (право Англии и Уэльса): force majeure действует по пункту договора; frustration — доктрина права, которая прекращает договор при исключительных обстоятельствах.",
    "task": {
     "q": "Which statement about force majeure is the most accurate?",
     "o": [
      "It always ends the contract automatically",
      "It applies to any event that makes performance more expensive",
      "It has the same effect in every country",
      "Its effect depends on the contract wording and the applicable law"
     ],
     "a": 3,
     "why": "Последствия зависят от пункта договора и права. Рост цен обычно не считается форс-мажором."
    }
   },
   {
    "t": "execute an agreement",
    "plain": "To sign an agreement and complete the formalities needed for it to be valid. (In another context, to execute can also mean to carry out or perform.)",
    "ru": "подписать (надлежащим образом оформить) договор; в другом контексте — исполнить",
    "jx": [
     {
      "j": "INT",
      "t": "Нужно различать три момента: подписание (signature), надлежащее оформление (execution) и вступление в силу (effective date). Подписанный договор может вступить в силу позже, например после оплаты аванса или по дате, указанной в договоре."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе для deed действуют специальные формальности (подпись, подтверждение свидетелем, передача — delivery). Для обычного договора формальности проще."
     },
     {
      "j": "US",
      "t": "В США формальности зависят от права штата и вида документа (электронная подпись, нотариальное удостоверение и др.)."
     },
     {
      "j": "KZ",
      "t": "Форма договора и момент вступления в силу определяются законом и договором; для некоторых сделок требуется нотариальная форма или регистрация. Проверяйте требования к конкретной сделке."
     }
    ],
    "ex": "This Agreement has been executed by the parties on the date stated at the beginning. It takes effect on the Effective Date.",
    "mistake": "Переводить execute только как «исполнить». В фразе executed as of the date речь о подписании. Не путать executed с effective: подписанный договор может ещё не вступить в силу.",
    "vs": "execute (оформить) vs sign (подписать) vs perform (исполнить) vs conclude (заключить): слова близки, но не взаимозаменяемы.",
    "task": {
     "q": "“The Agreement was executed on 1 March and takes effect on 1 April.” What does this show?",
     "o": [
      "It was cancelled on 1 April",
      "It was signed and completed on 1 March, but its terms apply from 1 April",
      "It was performed on 1 March",
      "It takes effect before it is signed"
     ],
     "a": 1,
     "why": "Execution (подписание, оформление) и effective date (вступление в силу) — разные даты."
    }
   },
   {
    "t": "claimant / plaintiff",
    "plain": "The person or organisation that starts a civil claim in court. The party against whom the claim is brought is the defendant.",
    "ru": "истец",
    "jx": [
     {
      "j": "US",
      "t": "В США используют plaintiff (в судах штатов и федеральных судах)."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе в гражданском процессе используется claimant (вместо прежнего plaintiff; изменение связано с введением Civil Procedure Rules в 1999 году)."
     },
     {
      "j": "INT",
      "t": "В международном арбитраже сторону, начавшую дело, обычно называют claimant, а другую — respondent."
     },
     {
      "j": "KZ",
      "t": "В русском тексте — «истец» и «ответчик». При переводе на английский выбирайте термин по системе, о которой пишете: plaintiff для США, claimant для Англии и Уэльса и для арбитража."
     }
    ],
    "ex": "The Claimant seeks damages of £20,000. / The plaintiff filed a complaint in federal court.",
    "mistake": "Использовать plaintiff для гражданских дел в Англии и Уэльсе или claimant как «заявитель» в уголовном деле. В уголовных делах дело ведёт государство (prosecution).",
    "vs": "plaintiff vs claimant: та же роль в разных системах. Defendant vs respondent: respondent чаще в арбитраже и апелляциях.",
    "task": {
     "q": "In civil litigation in England and Wales, the party who starts the case is usually called the …",
     "o": [
      "prosecutor",
      "witness",
      "claimant",
      "arbitrator"
     ],
     "a": 2,
     "why": "В Англии и Уэльсе — claimant. Prosecutor — в уголовном деле; witness — свидетель; arbitrator — арбитр."
    }
   },
   {
    "t": "breach of contract",
    "plain": "Failing to do what a contract requires, without a lawful excuse, for example not delivering, delivering late, or delivering the wrong goods.",
    "ru": "нарушение договора",
    "jx": [
     {
      "j": "US",
      "t": "В США часто различают material breach (существенное нарушение) и минорное; от серьёзности зависят доступные средства защиты."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе серьёзность нарушения важна для права прекратить договор (например, repudiatory breach). Доступные remedies — damages, в исключительных случаях specific performance."
     },
     {
      "j": "KZ",
      "t": "В казахстанском праве нарушение обязательства и существенное нарушение договора как основание для расторжения — понятия закона; детали проверяйте по тексту нормы."
     },
     {
      "j": "INT",
      "t": "Какие remedies доступны (damages, прекращение, реальное исполнение) и когда, зависит от договора и применимого права."
     }
    ],
    "ex": "Failure to deliver the goods by 30 November is a breach of contract.",
    "mistake": "Писать break the contract вместо breach или be in breach. Также не считать любое нарушение основанием сразу прекратить договор: это зависит от серьёзности нарушения и условий.",
    "vs": "breach vs default vs repudiation: breach — общее нарушение; default чаще о неоплате (например, по кредиту); repudiation — отказ исполнять договор.",
    "task": {
     "q": "Which situation is a breach of contract?",
     "o": [
      "The parties amend the contract in writing",
      "The contract ends at the end of its fixed term",
      "The Seller does not deliver the goods by the agreed date and has no contractual excuse",
      "The Buyer inspects the goods"
     ],
     "a": 2,
     "why": "Breach = невыполнение договорной обязанности без законного оправдания. Изменение, истечение срока и осмотр — не нарушения."
    }
   },
   {
    "t": "termination",
    "plain": "Ending a contract, usually under a termination clause or by law, so that future obligations stop.",
    "ru": "прекращение, расторжение договора",
    "jx": [
     {
      "j": "INT",
      "t": "Termination clause определяет, кто, когда и как может прекратить договор (по уведомлению, при существенном нарушении, при банкротстве). Нужно отличать expiry (истечение срока), termination (прекращение по пункту или праву) и rescission (аннулирование договора «с самого начала» по определённым основаниям). Что остаётся после прекращения (накопленные права, конфиденциальность), определяет договор."
     },
     {
      "j": "US",
      "t": "Детали прекращения и аннулирования зависят от права штата и вида договора."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе различают прекращение по пункту, по праву при нарушении (в серьёзных случаях) и другие основания."
     },
     {
      "j": "KZ",
      "t": "«Расторжение» обычно означает досрочное прекращение по соглашению, по суду или в одностороннем порядке при основаниях; «прекращение» шире и включает, например, исполнение и истечение срока. Выбирайте термин по контексту."
     }
    ],
    "ex": "Either party may terminate this Agreement by giving thirty days’ written notice.",
    "mistake": "Считать, что после termination пропадают все обязанности: оплата за уже выполненное и конфиденциальность могут сохраняться. Также не путать terminate и rescind.",
    "vs": "termination vs expiry vs rescission: прекращение по пункту или праву, естественное окончание срока, аннулирование с самого начала.",
    "task": {
     "q": "A contract ends because its fixed term of one year has finished. This is best described as …",
     "o": [
      "expiry",
      "breach",
      "rescission",
      "indemnity"
     ],
     "a": 0,
     "why": "Expiry — истечение срока. Termination — прекращение по пункту или праву; rescission — аннулирование договора с самого начала."
    }
   }
  ],
  "lessons": [
   {
    "id": "2.1",
    "title": "Definitions and interpretation",
    "ru": "Определения и толкование",
    "jur": [
     "INT"
    ],
    "intro": "Как договор объясняет свои термины и как их нужно читать.",
    "text": {
     "body": [
      "1.1 In this Agreement:",
      "“Goods” means the 100 office chairs described in Schedule 1.",
      "“Delivery Date” means 30 November.",
      "“Business Day” means a day other than a Saturday, a Sunday or a public holiday in Kazakhstan.",
      "1.2 In this Agreement: (a) headings are for convenience only and do not affect interpretation; (b) the singular includes the plural; (c) “including” means “including without limitation”."
     ],
     "ru": [
      "1.1 В настоящем договоре: «Товар» означает 100 офисных кресел, описанных в Приложении 1. «Дата поставки» означает 30 ноября. «Рабочий день» означает день, кроме субботы, воскресенья или официального праздничного дня в Казахстане.",
      "1.2 В настоящем договоре: (а) заголовки приведены для удобства и не влияют на толкование; (б) единственное число включает множественное; (в) «включая» означает «включая, но не ограничиваясь»."
     ]
    },
    "expr": [
     {
      "en": "“X” means …",
      "ru": "«X» означает …",
      "note": "Определение: термин с заглавной буквы всегда имеет это значение."
     },
     {
      "en": "for convenience only",
      "ru": "только для удобства",
      "note": "Заголовки не меняют смысл положений."
     },
     {
      "en": "the singular includes the plural",
      "ru": "единственное число включает множественное",
      "note": "Chair и chairs в тексте означают одно и то же."
     },
     {
      "en": "including without limitation",
      "ru": "включая, но не ограничиваясь",
      "note": "Список после including — примеры, а не исчерпывающий перечень."
     },
     {
      "en": "Schedule",
      "ru": "приложение",
      "note": "Часть договора, где обычно приведены подробности (описание товара, цены)."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "What does “Goods” mean in this Agreement?",
      "o": [
       "Any goods the Seller sells",
       "The price in Schedule 1",
       "The 100 office chairs described in Schedule 1",
       "The delivery address"
      ],
      "a": 2,
      "why": "Определение в 1.1: Goods = 100 офисных кресел из Schedule 1."
     },
     {
      "k": "mcq",
      "q": "Does a heading change the meaning of a clause?",
      "o": [
       "No, headings are for convenience only",
       "Yes, headings always control the meaning",
       "Yes, but only for definitions",
       "Only if the heading is in capital letters"
      ],
      "a": 0,
      "why": "Clause 1.2(a): headings do not affect interpretation."
     },
     {
      "k": "mcq",
      "q": "Is Sunday a Business Day under this Agreement?",
      "o": [
       "Yes",
       "Only in Kazakhstan",
       "Only for payments",
       "No"
      ],
      "a": 3,
      "why": "Business Day = день, кроме субботы, воскресенья и официального праздника."
     },
     {
      "k": "open",
      "q": "Why do contracts define terms and write them with capital letters?",
      "model": "So that each term has the same, clear meaning everywhere in the contract. This reduces disputes about what a word means.",
      "why": "Определения делают договор короче и точнее: не нужно повторять описание каждый раз."
     }
    ],
    "note": "Образец положения. Правила толкования договоров зависят от права."
   },
   {
    "id": "2.2",
    "title": "Representations and warranties",
    "ru": "Заверения и гарантии",
    "jur": [
     "INT",
     "EW",
     "US"
    ],
    "intro": "Как сторона заверяет в фактах и обещает, что они верны.",
    "text": {
     "body": [
      "The Seller represents and warrants to the Buyer that:",
      "(a) it is a company duly incorporated and validly existing under the laws of Kazakhstan;",
      "(b) it has the right to sell the Goods; and",
      "(c) the Goods are new and free from defects.",
      "If any of these statements is untrue, the Buyer may have remedies under this Agreement and under the applicable law."
     ],
     "ru": [
      "Продавец заверяет и гарантирует покупателю, что: (а) он является компанией, надлежащим образом созданной и действующей по праву Казахстана; (б) он вправе продавать товар; и (в) товар новый и без дефектов.",
      "Если какое-либо из этих утверждений неверно, покупатель может иметь средства защиты по настоящему договору и по применимому праву."
     ]
    },
    "expr": [
     {
      "en": "represents and warrants",
      "ru": "заверяет и гарантирует",
      "note": "Representation — утверждение о факте. Warranty — договорное обещание, что факт верен или стандарт соблюдён. В международных договорах слова часто используют вместе."
     },
     {
      "en": "duly incorporated",
      "ru": "надлежащим образом создана (зарегистрирована)",
      "note": "Duly = в соответствии с требованиями права."
     },
     {
      "en": "validly existing",
      "ru": "действующая",
      "note": "Компания существует как юридическое лицо."
     },
     {
      "en": "free from defects",
      "ru": "без дефектов",
      "note": "Стандарт качества товара."
     },
     {
      "en": "may have remedies",
      "ru": "может иметь средства защиты",
      "note": "Какие именно — зависит от договора и права."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Which statement is about the Seller as a company?",
      "o": [
       "(a) It is duly incorporated and validly existing",
       "(b) The Goods are new",
       "(c) The Goods are free from defects",
       "None of them"
      ],
      "a": 0,
      "why": "(a) — утверждение о существовании и статусе компании."
     },
     {
      "k": "mcq",
      "q": "Why does the Buyer want these statements in the contract?",
      "o": [
       "To avoid paying the price",
       "To rely on them and to have remedies if they are untrue",
       "To change the governing law",
       "To end the contract immediately"
      ],
      "a": 1,
      "why": "Заверения и гарантии дают покупателю основание полагаться на факты и средства защиты, если они неверны."
     },
     {
      "k": "mcq",
      "q": "The last sentence says the Buyer “may have remedies”. This means …",
      "o": [
       "remedies are possible, but depend on the contract and the applicable law",
       "the Buyer will always receive a refund",
       "the Buyer has no remedies",
       "the court will decide automatically"
      ],
      "a": 0,
      "why": "May have — возможность, а не гарантия результата."
     },
     {
      "k": "open",
      "q": "Explain the difference between a representation and a warranty.",
      "model": "A representation is a statement of fact made to persuade the other party to enter the contract. A warranty is a contractual promise that a statement is true or that something meets a stated standard. In many deals the two words are used together, but the legal consequences can differ between systems.",
      "why": "В праве Англии и Уэльса различие важно для средств защиты (misrepresentation и breach of warranty). Не считайте термины полностью взаимозаменяемыми."
     }
    ],
    "note": "Образец положения. Содержание и последствия заверений зависят от права и договора."
   },
   {
    "id": "2.3",
    "title": "Payment and delivery obligations",
    "ru": "Обязанности по оплате и поставке",
    "jur": [
     "INT"
    ],
    "intro": "Кто, что, когда и как должен сделать при оплате и поставке.",
    "text": {
     "body": [
      "3.1 The Buyer shall pay the price of USD 12,000 within 14 days after receipt of a valid invoice.",
      "3.2 The Seller shall deliver the Goods to the Buyer’s warehouse by the Delivery Date.",
      "3.3 Risk in the Goods passes to the Buyer on delivery.",
      "3.4 If the Buyer pays late, the Seller may charge interest on the overdue amount at the rate of 1% per month."
     ],
     "ru": [
      "3.1 Покупатель оплачивает цену 12 000 долларов США в течение 14 дней после получения надлежащего счёта.",
      "3.2 Продавец поставляет товар на склад покупателя до даты поставки.",
      "3.3 Риск в отношении товара переходит к покупателю при поставке.",
      "3.4 Если покупатель платит с опозданием, продавец вправе начислять проценты на просроченную сумму по ставке 1% в месяц."
     ]
    },
    "expr": [
     {
      "en": "within 14 days after receipt of a valid invoice",
      "ru": "в течение 14 дней после получения надлежащего счёта",
      "note": "Срок идёт от получения счёта, и счёт должен быть надлежащим."
     },
     {
      "en": "deliver … to the Buyer’s warehouse",
      "ru": "поставить … на склад покупателя",
      "note": "Место поставки — часть обязанности продавца."
     },
     {
      "en": "risk passes",
      "ru": "риск переходит",
      "note": "Risk — кто несёт убыток, если товар утрачен или повреждён. Момент перехода риска указывают в договоре или определяют по праву."
     },
     {
      "en": "overdue amount",
      "ru": "просроченная сумма",
      "note": "Сумма, которую должны были заплатить, но не заплатили в срок."
     },
     {
      "en": "interest",
      "ru": "проценты",
      "note": "Ставка в учебном примере выдумана; допустимый размер процентов может ограничиваться правом."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "What starts the 14-day payment period?",
      "o": [
       "The Delivery Date",
       "Receipt of a valid invoice",
       "The date of the contract",
       "The date the goods are ordered"
      ],
      "a": 1,
      "why": "Within 14 days after receipt of a valid invoice."
     },
     {
      "k": "mcq",
      "q": "Who bears the risk of loss of the Goods after delivery (clause 3.3)?",
      "o": [
       "The Seller",
       "Both equally",
       "A court",
       "The Buyer"
      ],
      "a": 3,
      "why": "Risk passes to the Buyer on delivery."
     },
     {
      "k": "mcq",
      "q": "Which clause allows the Seller to charge interest?",
      "o": [
       "Clause 3.1",
       "Clause 3.2",
       "Clause 3.4, if the Buyer pays late",
       "Clause 3.3"
      ],
      "a": 2,
      "why": "3.4: If the Buyer pays late, the Seller may charge interest."
     },
     {
      "k": "open",
      "q": "Explain in your own words what “overdue amount” means in clause 3.4.",
      "model": "An overdue amount is money that the Buyer should have paid by the due date but has not yet paid.",
      "why": "Overdue = просроченный: срок платежа уже прошёл."
     }
    ],
    "note": "Выдуманный образец (цена и ставка процентов — учебные). Реальные условия и ограничения зависят от договора и права."
   },
   {
    "id": "2.4",
    "title": "Breach, liability and damages",
    "ru": "Нарушение, ответственность и возмещение",
    "jur": [
     "INT",
     "EW",
     "US"
    ],
    "intro": "Как договор распределяет последствия нарушения и ограничивает ответственность.",
    "text": {
     "body": [
      "5.1 If the Seller fails to deliver the Goods by the Delivery Date, the Buyer may (a) set a new deadline by written notice; or (b) terminate this Agreement if the Goods are not delivered within 10 days after that notice.",
      "5.2 The Seller is liable for direct losses caused by its breach.",
      "5.3 Neither party is liable for indirect or consequential losses.",
      "5.4 The Seller’s total liability under this Agreement shall not exceed the price paid by the Buyer."
     ],
     "ru": [
      "5.1 Если продавец не поставит товар до даты поставки, покупатель вправе (а) установить новый срок письменным уведомлением; либо (б) прекратить договор, если товар не поставлен в течение 10 дней после этого уведомления.",
      "5.2 Продавец отвечает за прямые убытки, вызванные его нарушением.",
      "5.3 Ни одна из сторон не отвечает за косвенные убытки и убытки как следствие.",
      "5.4 Общая ответственность продавца по настоящему договору не превышает уплаченной покупателем цены."
     ]
    },
    "expr": [
     {
      "en": "fails to deliver",
      "ru": "не поставит",
      "note": "Невыполнение обязанности — основание для remedies."
     },
     {
      "en": "set a new deadline",
      "ru": "установить новый срок",
      "note": "Покупатель даёт ещё один срок до того, как прекратить договор."
     },
     {
      "en": "direct losses",
      "ru": "прямые убытки",
      "note": "Убытки, которые непосредственно вытекают из нарушения."
     },
     {
      "en": "indirect or consequential losses",
      "ru": "косвенные убытки и убытки как следствие",
      "note": "Отдалённые последствия. Что именно считать прямым, а что косвенным (например, упущенную выгоду), определяют договор и право."
     },
     {
      "en": "shall not exceed",
      "ru": "не превышает",
      "note": "Cap — потолок ответственности."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Which clause gives the Buyer a right to end the Agreement?",
      "o": [
       "Clause 5.1(b)",
       "Clause 5.2",
       "Clause 5.3",
       "Clause 5.4"
      ],
      "a": 0,
      "why": "5.1(b): terminate if the Goods are not delivered within 10 days after the notice."
     },
     {
      "k": "mcq",
      "q": "What does clause 5.4 do?",
      "o": [
       "It caps the Seller’s total liability at the price paid",
       "It increases the Seller’s liability",
       "It excludes all remedies of the Buyer",
       "It decides which court hears disputes"
      ],
      "a": 0,
      "why": "Limitation of liability: общий лимит ответственности."
     },
     {
      "k": "mcq",
      "q": "Does clause 5.3 clearly say that lost profit is always excluded?",
      "o": [
       "Yes, lost profit is always indirect",
       "Yes, lost profit is always direct",
       "Clause 5.3 is about delivery dates",
       "No, it depends on whether lost profit is direct or indirect under the contract and the applicable law"
      ],
      "a": 3,
      "why": "Классификация упущенной выгоды зависит от формулировки и права. Нельзя считать, что она всегда прямая или всегда косвенная."
     },
     {
      "k": "open",
      "q": "Why would a seller want a clause like 5.4?",
      "model": "It limits the maximum amount the seller may have to pay if it breaches the contract, so the seller can predict and manage its risk.",
      "why": "Но такие пункты могут быть ограничены правом (например, нельзя исключить ответственность за некоторые виды вреда). Проверяйте применимое право."
     }
    ],
    "note": "Образец положений. Действительность ограничения ответственности зависит от права."
   },
   {
    "id": "2.5",
    "title": "Force majeure and termination",
    "ru": "Форс-мажор и прекращение договора",
    "jur": [
     "INT"
    ],
    "intro": "Что происходит, когда исполнению мешает событие вне контроля сторон.",
    "text": {
     "body": [
      "12.3 If a Force Majeure Event prevents a party from performing its obligations, that party shall promptly notify the other party in writing and shall use reasonable efforts to reduce the effect of the event.",
      "12.4 The affected party’s obligations are suspended for as long as the event continues.",
      "12.5 If the event continues for more than 60 days, either party may terminate this Agreement by written notice."
     ],
     "ru": [
      "12.3 Если событие непреодолимой силы мешает стороне исполнять обязательства, эта сторона незамедлительно письменно уведомляет другую сторону и прилагает разумные усилия для уменьшения последствий события.",
      "12.4 Обязательства пострадавшей стороны приостанавливаются на время действия события.",
      "12.5 Если событие длится более 60 дней, любая сторона вправе прекратить договор письменным уведомлением."
     ]
    },
    "expr": [
     {
      "en": "Force Majeure Event",
      "ru": "событие непреодолимой силы",
      "note": "С заглавной буквы: термин определён в договоре (обычно перечнем и общей формулировкой)."
     },
     {
      "en": "promptly notify … in writing",
      "ru": "незамедлительно письменно уведомить",
      "note": "Уведомление — условие, которое нельзя пропускать."
     },
     {
      "en": "reasonable efforts",
      "ru": "разумные усилия",
      "note": "Нужно принять разумные меры, а не любые возможные."
     },
     {
      "en": "suspended",
      "ru": "приостановлены",
      "note": "Обязанность временно не исполняется, но не исчезает."
     },
     {
      "en": "terminate by written notice",
      "ru": "прекратить письменным уведомлением",
      "note": "Право на прекращение возникает через 60 дней и осуществляется уведомлением."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "What must the affected party do first (clause 12.3)?",
      "o": [
       "Terminate the Agreement",
       "Pay damages",
       "Wait for a court order",
       "Promptly notify the other party in writing and try to reduce the effect"
      ],
      "a": 3,
      "why": "12.3: notify promptly in writing and use reasonable efforts."
     },
     {
      "k": "mcq",
      "q": "What happens to the affected party’s obligations while the event continues (12.4)?",
      "o": [
       "They are cancelled forever",
       "They double",
       "They are suspended",
       "They pass to the other party"
      ],
      "a": 2,
      "why": "Suspended = временно не исполняются."
     },
     {
      "k": "mcq",
      "q": "After how long may either party terminate (12.5)?",
      "o": [
       "After 10 days",
       "Immediately",
       "Only after a court judgment",
       "If the event continues for more than 60 days"
      ],
      "a": 3,
      "why": "12.5: more than 60 days."
     },
     {
      "k": "open",
      "q": "Why is prompt written notice important in a force majeure clause?",
      "model": "The clause usually requires notice as a condition for relying on force majeure, and notice lets the other party plan and react.",
      "why": "Если уведомление не направлено вовремя, сторона может потерять право ссылаться на force majeure. Это зависит от текста пункта и права."
     }
    ],
    "note": "Образец положений. Эффект force majeure зависит от договора и применимого права."
   },
   {
    "id": "2.6",
    "title": "Governing law and dispute resolution",
    "ru": "Применимое право и разрешение споров",
    "jur": [
     "INT",
     "EW"
    ],
    "intro": "Чем отличаются право, суд и арбитраж.",
    "text": {
     "body": [
      "14.1 This Agreement is governed by the laws of England and Wales.",
      "14.2 If a dispute arises out of or in connection with this Agreement, the parties shall first discuss it in good faith for 30 days.",
      "14.3 If the dispute is not resolved, either party may bring proceedings in the courts of England and Wales, which shall have non-exclusive jurisdiction."
     ],
     "ru": [
      "14.1 Настоящий договор регулируется правом Англии и Уэльса.",
      "14.2 Если возникнет спор, вытекающий из настоящего договора или связанный с ним, стороны сначала в течение 30 дней обсуждают его добросовестно.",
      "14.3 Если спор не урегулирован, любая сторона вправе обратиться в суды Англии и Уэльса, которые обладают неисключительной юрисдикцией."
     ]
    },
    "expr": [
     {
      "en": "is governed by",
      "ru": "регулируется (применимо право)",
      "note": "Выбирает право, а не суд."
     },
     {
      "en": "arises out of or in connection with",
      "ru": "вытекает из или связан с",
      "note": "Широкая формула: покрывает споры, связанные с договором."
     },
     {
      "en": "in good faith",
      "ru": "добросовестно",
      "note": "Стороны должны искренне стараться договориться. Как этот стандарт толкуют суды, зависит от права."
     },
     {
      "en": "non-exclusive jurisdiction",
      "ru": "неисключительная юрисдикция",
      "note": "Названные суды могут рассматривать спор, но другие суды не исключены."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Which clause chooses the law?",
      "o": [
       "Clause 14.2",
       "Clause 14.3",
       "Clause 14.1",
       "None of them"
      ],
      "a": 2,
      "why": "14.1 — governing law."
     },
     {
      "k": "mcq",
      "q": "Which clause chooses the courts?",
      "o": [
       "Clause 14.1",
       "Clause 14.3",
       "Clause 14.2",
       "None of them"
      ],
      "a": 1,
      "why": "14.3 — jurisdiction."
     },
     {
      "k": "mcq",
      "q": "What must the parties do before going to court?",
      "o": [
       "Go to arbitration",
       "Discuss the dispute in good faith for 30 days",
       "Terminate the contract",
       "Pay interest"
      ],
      "a": 1,
      "why": "14.2 требует сначала обсудить спор."
     },
     {
      "k": "mcq",
      "q": "“Non-exclusive jurisdiction” means that …",
      "o": [
       "no court may hear the dispute",
       "only an arbitrator may hear the dispute",
       "the contract has no governing law",
       "the named courts may hear the dispute, but other courts are not necessarily excluded"
      ],
      "a": 3,
      "why": "Non-exclusive — не исключает другие суды."
     }
    ],
    "note": "Пример использует право Англии и Уэльса только для иллюстрации; это не рекомендация выбрать такое право."
   }
  ]
 },
 {
  "id": 3,
  "ready": true,
  "title": "Legal Reading and Writing",
  "ru": "Юридическое чтение и письмо",
  "cefr": "ориентир: примерно B2 (проектная модель LAWSTART, не сертификация CEFR)",
  "summary": "Чтение юридических положений, факты, нормы и аргументы, краткое изложение, профессиональное письмо и базовый меморандум.",
  "goals": [
   {
    "en": "Read a short legal provision and say who must, may or must not do what, and when.",
    "ru": "Читать короткое юридическое положение и определять, кто должен, вправе или не должен что-то делать и когда."
   },
   {
    "en": "Separate facts, rules and arguments, and state the legal issue as a question.",
    "ru": "Разделять факты, нормы и аргументы и формулировать правовой вопрос."
   },
   {
    "en": "Write a short legal summary: facts, issue, rule, application and a provisional conclusion.",
    "ru": "Писать краткое изложение: факты, вопрос, норма, применение и предварительный вывод."
   },
   {
    "en": "Write a clear subject line and a polite, precise professional email with a deadline.",
    "ru": "Писать понятную тему письма и вежливое, точное профессиональное письмо со сроком."
   },
   {
    "en": "Choose clear and professional wording and avoid vague or too casual phrases.",
    "ru": "Выбирать ясные формулировки и избегать расплывчатых или слишком неформальных."
   },
   {
    "en": "Understand the structure of a basic legal memorandum.",
    "ru": "Понимать структуру базового юридического меморандума."
   }
  ],
  "concepts": [
   {
    "h": "Reading a legal provision",
    "en": "Read a provision in four steps. First, find the subject: who is the rule about? Second, find the verb that shows the force of the rule: must (duty), may (permission), must not (prohibition). Third, find conditions, exceptions and deadlines: if, unless, provided that, within, at least. Fourth, find the consequence: what happens if the rule is not followed? Then restate the provision in your own plain words."
   },
   {
    "h": "Facts, issues, rules and arguments",
    "en": "Facts are things that happened (“The laptop arrived on 10 June”). The issue is the legal question (“May the Buyer cancel?”). A rule is a statement of what the law or the contract requires (“If the Seller delivers more than 7 days late, the Buyer may cancel”). An argument is what a party says the rule means or how it applies (“The delay was caused by a strike”). Keep these four separate in your notes."
   },
   {
    "h": "Writing a short legal summary",
    "en": "A short legal summary has five parts: Facts (what happened), Issue (the question), Rule (the relevant provision), Application (how the rule applies to the facts) and Conclusion (your provisional answer). Use short sentences and neutral words. State what you do not know. A conclusion is provisional if some facts or the applicable law are still to be checked."
   },
   {
    "h": "A basic legal memorandum",
    "en": "A legal memorandum is an internal document that analyses a legal question. A common US-style structure is: heading (To, From, Date, Re), Question Presented, Brief Answer, Facts, Analysis and Conclusion. Firms and countries use different headings, but the aim is the same: a clear question, a short answer and reasoning that the reader can check."
   },
   {
    "h": "The shape of a formal legal email",
    "en": "A good legal email has: a clear subject line with a reference (for example, the name of the contract or a file number); a polite greeting; one sentence that explains why you are writing; the background facts; the request; a deadline; a polite closing; your name and role. Keep paragraphs short. Do not hide the request in the middle of a long text."
   },
   {
    "h": "Greetings and endings",
    "en": "If you do not know the name, British formal letters use “Dear Sir or Madam” and end with “Yours faithfully”. If you use a name, such as “Dear Ms Karimova”, end with “Yours sincerely”. In emails, “Kind regards” is common and acceptable. American English often uses “Sincerely” or “Best regards”. Follow the style of the organisation you write to."
   },
   {
    "h": "Polite but precise requests",
    "en": "Polite does not mean vague. Compare: “Send the documents.” (too direct), “Please send documents soon.” (polite but vague), and “I would be grateful if you could send me the signed contract and the invoice by 5 p.m. on Friday, 16 October.” (polite and precise). Name the document, name the action and give a date and time."
   },
   {
    "h": "Summarising a legal issue in an email",
    "en": "Use three steps: Facts (what happened), Issue (what question needs an answer) and Request (what you ask the reader to do). Example: “Facts: The Supplier delivered the goods on 10 June, nine days late. Issue: Whether the Buyer may cancel the agreement under clause 3. Request: Please confirm your position by Friday.”"
   }
  ],
  "vocab": [
   {
    "t": "with reference to",
    "ru": "в связи с, ссылаясь на",
    "def": "a formal phrase used to point to an earlier document or message",
    "ex": "With reference to your letter of 3 October, I confirm the following."
   },
   {
    "t": "further to",
    "ru": "в продолжение (разговора, письма)",
    "def": "a formal phrase used to continue an earlier conversation or message",
    "ex": "Further to our call this morning, I enclose the draft."
   },
   {
    "t": "Please find attached",
    "ru": "Прилагаю (во вложении)",
    "def": "a formal way to say that a document is attached to your email",
    "ex": "Please find attached the signed Supply Agreement."
   },
   {
    "t": "I would be grateful if you could …",
    "ru": "Буду признателен, если Вы сможете …",
    "def": "a polite, formal way to make a request",
    "ex": "I would be grateful if you could confirm the delivery date."
   },
   {
    "t": "acknowledge receipt",
    "ru": "подтвердить получение",
    "def": "to tell the sender that you have received something",
    "ex": "Please acknowledge receipt of this email."
   },
   {
    "t": "at your earliest convenience",
    "ru": "при первой возможности",
    "def": "as soon as you reasonably can; it does not give an exact date",
    "ex": "Please reply at your earliest convenience."
   },
   {
    "t": "for the avoidance of doubt",
    "ru": "во избежание сомнений",
    "def": "a phrase used to make something completely clear",
    "ex": "For the avoidance of doubt, the deadline is 16 October."
   },
   {
    "t": "in accordance with",
    "ru": "в соответствии с",
    "def": "following a rule, clause or instruction",
    "ex": "We will deliver the goods in accordance with clause 4."
   },
   {
    "t": "deadline",
    "ru": "крайний срок",
    "def": "the latest date or time by which something must be done",
    "ex": "The deadline for comments is 5 p.m. on Friday."
   },
   {
    "t": "confidential",
    "ru": "конфиденциальный",
    "def": "secret; not to be shared with other people without permission",
    "ex": "This email is confidential and intended only for the addressee."
   },
   {
    "t": "cc (carbon copy)",
    "ru": "копия (в копии)",
    "def": "a person who receives a copy of an email for information",
    "ex": "I have copied our client in cc."
   },
   {
    "t": "Yours faithfully / Yours sincerely",
    "ru": "С уважением (британские формулы)",
    "def": "formal endings of a letter: faithfully after “Dear Sir or Madam”, sincerely after a name",
    "ex": "Dear Ms Karimova, … Yours sincerely, A. Smith"
   },
   {
    "t": "provision",
    "ru": "положение, норма (договора, закона)",
    "def": "a part of a contract or law that deals with one subject",
    "ex": "This provision applies only to consumers."
   },
   {
    "t": "issue",
    "ru": "правовой вопрос, предмет спора",
    "def": "the legal question that needs an answer",
    "ex": "The issue is whether the Buyer may cancel the agreement."
   },
   {
    "t": "rule",
    "ru": "норма, правило",
    "def": "a statement of what the law or a contract requires, allows or prohibits",
    "ex": "The rule in clause 3 gives the Buyer a right to cancel."
   },
   {
    "t": "argument",
    "ru": "довод, аргумент",
    "def": "a reason that a party gives to support its position",
    "ex": "The Seller’s argument is that the delay was outside its control."
   },
   {
    "t": "application",
    "ru": "применение (нормы к фактам)",
    "def": "the step where you explain how a rule works on the facts",
    "ex": "In the application, the delay of nine days exceeds the seven-day limit."
   },
   {
    "t": "conclusion",
    "ru": "вывод",
    "def": "the answer to the legal question, based on the facts and the rule",
    "ex": "Our provisional conclusion is that the Buyer may cancel."
   },
   {
    "t": "memorandum (memo)",
    "ru": "меморандум, внутренняя записка",
    "def": "an internal document that analyses a legal question for a reader",
    "ex": "I attach a short memo on the cancellation right."
   },
   {
    "t": "pursuant to",
    "ru": "в соответствии с, на основании",
    "def": "a formal phrase meaning ‘following’ or ‘under’ a rule or a clause",
    "ex": "The notice was given pursuant to clause 12."
   }
  ],
  "texts": [
   {
    "title": "Email 1: Request for documents (original example)",
    "body": [
     "Subject: Request for documents – Supply Agreement dated 1 September (ref. LS/2026/14)",
     "Dear Mr Omarov,",
     "I am writing on behalf of Alpha Trading LLP with reference to the Supply Agreement dated 1 September.",
     "I would be grateful if you could send me (1) a signed copy of the Agreement and (2) the invoice for the first delivery. For the avoidance of doubt, we need both documents by 5 p.m. on Friday, 16 October.",
     "Please acknowledge receipt of this email.",
     "Kind regards,",
     "Dana Sarsen",
     "Legal Assistant"
    ],
    "note": "Names and companies are invented.",
    "qs": [
     {
      "q": "What is the purpose of the email?",
      "o": [
       "To cancel the Agreement",
       "To request two documents",
       "To complain about the price",
       "To invite Mr Omarov to a meeting"
      ],
      "a": 1,
      "why": "The writer asks for a signed copy of the Agreement and the invoice."
     },
     {
      "q": "What is the deadline?",
      "o": [
       "At your earliest convenience",
       "5 p.m. on Friday, 16 October",
       "Next year",
       "No deadline is given"
      ],
      "a": 1,
      "why": "A precise date and time are given."
     },
     {
      "q": "Which phrase makes the request polite?",
      "o": [
       "Send me",
       "I would be grateful if you could",
       "You must",
       "Hurry up"
      ],
      "a": 1,
      "why": "“I would be grateful if you could …” is a polite formal request."
     }
    ]
   },
   {
    "title": "Email 2: Weak and improved versions (original example)",
    "body": [
     "Weak: “Hi. Where is the money? Pay now!!!”",
     "Improved: “Dear Ms Nurlan, With reference to invoice no. 45 dated 1 October, I note that the payment of USD 2,000 has not yet been received. I would be grateful if you could confirm when payment will be made. Please reply by Friday, 16 October. Kind regards, Ruslan Aliyev.”"
    ],
    "note": "Names and amounts are invented.",
    "qs": [
     {
      "q": "Why is the improved email better?",
      "o": [
       "It is longer",
       "It states the invoice, the problem, the request and the date politely and precisely",
       "It uses exclamation marks",
       "It avoids the topic of payment"
      ],
      "a": 1,
      "why": "It identifies the document, states the facts, makes a clear request and gives a date."
     },
     {
      "q": "Which phrase refers to an earlier document?",
      "o": [
       "Kind regards",
       "With reference to invoice no. 45",
       "Pay now",
       "Hi"
      ],
      "a": 1,
      "why": "“With reference to …” points to something already sent."
     },
     {
      "q": "What does the writer ask Ms Nurlan to do?",
      "o": [
       "Confirm when payment will be made",
       "Cancel the invoice",
       "Send a new contract",
       "Visit the office"
      ],
      "a": 0,
      "why": "“confirm when payment will be made”."
     }
    ]
   }
  ],
  "speak": {
   "phrases": [
    {
     "en": "I am writing with reference to the Supply Agreement dated first of September.",
     "ru": "Пишу в связи с договором поставки от 1 сентября."
    },
    {
     "en": "I would be grateful if you could send me a signed copy by five p.m. on Friday.",
     "ru": "Буду признателен, если Вы пришлёте подписанную копию до 17:00 в пятницу."
    },
    {
     "en": "Please acknowledge receipt of this email.",
     "ru": "Пожалуйста, подтвердите получение этого письма."
    },
    {
     "en": "For the avoidance of doubt, the deadline is the sixteenth of October.",
     "ru": "Во избежание сомнений: срок — 16 октября."
    }
   ],
   "dialogue": {
    "title": "Dialogue: a phone call before an email",
    "lines": [
     {
      "who": "Lawyer",
      "en": "Good morning, this is Dana Sarsen from Alpha Trading. I am calling about the Supply Agreement."
     },
     {
      "who": "Client",
      "en": "Good morning. How can I help?"
     },
     {
      "who": "Lawyer",
      "en": "We have not yet received the signed copy. Could you send it by Friday?"
     },
     {
      "who": "Client",
      "en": "Yes, I will send it by five p.m. on Friday."
     },
     {
      "who": "Lawyer",
      "en": "Thank you. I will confirm this by email. Please acknowledge receipt."
     },
     {
      "who": "Client",
      "en": "Of course. Thank you for your call."
     }
    ]
   },
   "prompts": [
    {
     "q": "Politely ask a colleague to send you a document by Friday. Say it aloud.",
     "model": "I would be grateful if you could send me the document by five p.m. on Friday."
    },
    {
     "q": "Summarise a legal issue in three short sentences: facts, issue, request.",
     "model": "The Supplier delivered the goods nine days late. The question is whether the Buyer may cancel the agreement. Please confirm your position by Friday."
    }
   ]
  },
  "test": [
   {
    "q": "Which subject line is the best for an email requesting documents?",
    "o": [
     "Hello",
     "URGENT!!!",
     "Question",
     "Request for documents – Supply Agreement No. 12 (ref. LS/2026/14)"
    ],
    "a": 3,
    "why": "A clear subject names the purpose and gives a reference."
   },
   {
    "q": "You do not know the name of the person you write to. Which greeting is the most suitable in a formal letter?",
    "o": [
     "Hi guys,",
     "Dear Sir or Madam,",
     "Yo,",
     "Hello my friend,"
    ],
    "a": 1,
    "why": "Dear Sir or Madam is the formal greeting when the name is unknown."
   },
   {
    "q": "Which request is polite and precise?",
    "o": [
     "I would be grateful if you could send me the signed contract by 15 October.",
     "Send the contract.",
     "Contract?",
     "You must send the contract."
    ],
    "a": 0,
    "why": "It is polite and names the document, the action and the date."
   },
   {
    "q": "In a British formal letter that begins “Dear Sir or Madam”, the usual ending is …",
    "o": [
     "Yours sincerely",
     "Yours faithfully",
     "See you",
     "Cheers"
    ],
    "a": 1,
    "why": "Convention: Dear Sir or Madam → Yours faithfully. American English often uses Sincerely."
   },
   {
    "q": "When you summarise a legal issue, which structure is the most helpful?",
    "o": [
     "Jokes, then the conclusion",
     "Only the conclusion without facts",
     "Facts, then the issue, then the request",
     "Random order"
    ],
    "a": 2,
    "why": "Facts → Issue → Request is clear for the reader."
   },
   {
    "q": "Which sentence gives the most precise deadline?",
    "o": [
     "Please reply soon.",
     "Reply whenever you can.",
     "ASAP!!!",
     "Please reply by 5 p.m. on Friday, 16 October."
    ],
    "a": 3,
    "why": "A date and time leave no doubt."
   },
   {
    "q": "Which sentence is a fact?",
    "o": [
     "If the Seller delivers more than 7 days late, the Buyer may cancel.",
     "The laptop arrived on 10 June.",
     "The Seller says the delay was caused by a customs strike.",
     "Dana may cancel the purchase."
    ],
    "a": 1,
    "why": "Факт — событие, которое произошло. Остальное: норма, довод и вывод."
   },
   {
    "q": "Which sentence states a legal issue?",
    "o": [
     "The laptop arrived on 10 June",
     "Whether the Buyer may cancel the agreement because delivery was nine days late",
     "The Seller is a large company",
     "The delay was caused by a strike"
    ],
    "a": 1,
    "why": "Issue формулируется как правовой вопрос."
   },
   {
    "q": "“A supplier must give a customer at least 30 days’ written notice.” “At least 30 days” means …",
    "o": [
     "exactly 30 days",
     "no more than 30 days",
     "30 days or less",
     "30 days or more"
    ],
    "a": 3,
    "why": "At least = минимум."
   },
   {
    "q": "In a legal summary, a conclusion is “provisional” when …",
    "o": [
     "the lawyer does not like the client",
     "the case is finished",
     "the court has decided",
     "some facts or the applicable law still have to be checked"
    ],
    "a": 3,
    "why": "Provisional = предварительный."
   },
   {
    "q": "In a US-style legal memorandum, the “Brief Answer” …",
    "o": [
     "lists all witnesses",
     "repeats the signatures",
     "gives a short answer to the question presented",
     "is written by the opposing party"
    ],
    "a": 2,
    "why": "Brief Answer отвечает на вопрос коротко, до подробного анализа."
   },
   {
    "q": "“The delay was caused by a customs strike” is, in the story, …",
    "o": [
     "a rule of the contract",
     "the Seller’s argument",
     "a court’s conclusion",
     "the legal issue"
    ],
    "a": 1,
    "why": "Это довод продавца; он должен быть доказан и может не влиять на результат."
   }
  ],
  "rev": 2,
  "topics": [
   "reading a legal provision",
   "identifying facts and legal issues",
   "distinguishing facts, rules and arguments",
   "writing a short legal summary",
   "drafting a professional email",
   "writing a basic legal memorandum"
  ],
  "terms": [
   {
    "t": "issue",
    "plain": "The legal question that has to be answered in a case or a problem.",
    "ru": "правовой вопрос; предмет спора",
    "jx": [
     {
      "j": "INT",
      "t": "В юридическом анализе issue формулируют как вопрос: Whether the Buyer may cancel the agreement under clause 3. Формулировка должна опираться на факты и применимую норму."
     },
     {
      "j": "US",
      "t": "В американской учебной практике анализ часто строят по схеме IRAC (Issue, Rule, Application, Conclusion)."
     },
     {
      "j": "EW",
      "t": "Названия частей анализа различаются, но логика та же: вопрос, норма, применение, вывод."
     }
    ],
    "ex": "The issue is whether the delay entitles the Buyer to cancel the agreement.",
    "mistake": "Формулировать issue как тему, а не как вопрос (Cancellation). Лучше: Whether the Buyer may cancel …",
    "vs": "issue (правовой вопрос) vs problem (общая проблема) vs dispute (спор между сторонами).",
    "task": {
     "q": "Which sentence states a legal issue?",
     "o": [
      "The laptop arrived on 10 June",
      "Whether the Buyer may cancel the agreement because delivery was nine days late",
      "If the Seller delivers more than 7 days late, the Buyer may cancel",
      "The Seller says there was a customs strike"
     ],
     "a": 1,
     "why": "Issue — вопрос. Первая фраза — факт, вторая — норма, третья — аргумент."
    }
   },
   {
    "t": "rule",
    "plain": "A statement of what a law or a contract requires, allows or prohibits.",
    "ru": "норма, правило",
    "jx": [
     {
      "j": "INT",
      "t": "Rule может быть нормой закона, пунктом договора или правилом из судебной практики. В анализе указывайте источник нормы (какой закон, какой пункт)."
     },
     {
      "j": "US",
      "t": "В американской практике rule часто означает правило, выведенное из закона или решения суда."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе источниками правил служат законы (statutes) и судебные прецеденты (case law)."
     }
    ],
    "ex": "The rule is stated in clause 3: if the Seller delivers more than seven days late, the Buyer may cancel.",
    "mistake": "Смешивать rule и argument: норма — это то, что требует право или договор; довод — то, что утверждает сторона.",
    "vs": "rule vs argument vs fact: норма, довод стороны, событие.",
    "task": {
     "q": "“If the Seller delivers more than 7 days late, the Buyer may cancel.” This sentence is …",
     "o": [
      "a fact",
      "an argument of the Seller",
      "a conclusion",
      "a rule"
     ],
     "a": 3,
     "why": "Это норма (здесь — пункт договора), которая связывает условие с последствием."
    }
   },
   {
    "t": "argument (submission)",
    "plain": "A reason that a party gives to support its position in a dispute.",
    "ru": "довод, аргумент (в суде — также submission)",
    "jx": [
     {
      "j": "INT",
      "t": "Аргумент отражает позицию стороны, а не обязательно истину. В анализе нужно изложить аргументы обеих сторон и оценить их."
     },
     {
      "j": "EW",
      "t": "В английском судебном и арбитражном языке часто используют submission для довода, который представитель стороны излагает суду."
     },
     {
      "j": "US",
      "t": "В США чаще говорят argument."
     }
    ],
    "ex": "The Seller’s argument is that the delay was caused by a customs strike.",
    "mistake": "Выдавать аргумент стороны за факт: The delay was caused by a strike — это утверждение продавца, пока оно не доказано.",
    "vs": "argument vs fact vs evidence: довод, событие, доказательство.",
    "task": {
     "q": "“The delay was caused by a customs strike.” In the story, this is …",
     "o": [
      "a rule of the contract",
      "the Seller’s argument (a claim that still has to be proved)",
      "the legal issue",
      "a court’s conclusion"
     ],
     "a": 1,
     "why": "Это довод продавца: пока он не доказан, нельзя считать его установленным фактом."
    }
   },
   {
    "t": "memorandum (memo)",
    "plain": "An internal document that analyses a legal question and gives an answer or recommendation.",
    "ru": "меморандум, внутренняя записка",
    "jx": [
     {
      "j": "US",
      "t": "Классическая структура американского меморандума: heading, Question Presented, Brief Answer, Facts, Analysis (Discussion), Conclusion."
     },
     {
      "j": "EW",
      "t": "В Англии и Уэльсе внутренние записки и консультации (advice notes) могут иметь иные заголовки; структура зависит от фирмы и адресата."
     },
     {
      "j": "INT",
      "t": "Хороший меморандум начинается с короткого ответа, чтобы занятой читатель сразу понял вывод."
     }
    ],
    "ex": "I attach a short memo on whether the Buyer may cancel.",
    "mistake": "Писать меморандум как рассказ без вывода. Читатель должен быстро найти вопрос и краткий ответ.",
    "vs": "memorandum vs letter vs email: внутренний анализ, внешнее письмо, быстрое электронное сообщение.",
    "task": {
     "q": "In a US-style legal memorandum, which section gives a short answer to the question?",
     "o": [
      "Facts",
      "Heading",
      "Analysis",
      "Brief Answer"
     ],
     "a": 3,
     "why": "Brief Answer — короткий ответ. Analysis — подробное обоснование; Facts — события."
    }
   }
  ],
  "lessons": [
   {
    "id": "3.1",
    "title": "Reading a legal provision",
    "ru": "Чтение юридического положения",
    "jur": [
     "INT"
    ],
    "intro": "Найдите субъект, глагол, условия, исключения и последствие.",
    "text": {
     "body": [
      "Section 4. Notice of price change",
      "(1) A supplier of services must give a customer at least 30 days’ written notice of any increase in the price.",
      "(2) Subsection (1) does not apply if the increase is required by law.",
      "(3) A supplier that does not comply with subsection (1) may not charge the increased price during the notice period."
     ],
     "ru": [
      "Статья 4. Уведомление об изменении цены",
      "(1) Поставщик услуг обязан направить клиенту письменное уведомление о любом повышении цены не менее чем за 30 дней.",
      "(2) Пункт (1) не применяется, если повышение требуется по закону.",
      "(3) Поставщик, не выполнивший пункт (1), не вправе взимать повышенную цену в течение срока уведомления."
     ]
    },
    "expr": [
     {
      "en": "must give … at least 30 days’ written notice",
      "ru": "обязан направить … письменное уведомление не менее чем за 30 дней",
      "note": "Must — обязанность. At least — минимальный срок."
     },
     {
      "en": "does not apply if",
      "ru": "не применяется, если",
      "note": "Исключение из правила."
     },
     {
      "en": "is required by law",
      "ru": "требуется по закону",
      "note": "Повышение цены по закону — исключение."
     },
     {
      "en": "comply with",
      "ru": "соблюдать, выполнять",
      "note": "Comply with a provision = выполнить предписание."
     },
     {
      "en": "may not charge",
      "ru": "не вправе взимать",
      "note": "May not здесь означает запрет, но в договорах лучше писать must not."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Who must give the notice?",
      "o": [
       "A customer",
       "A court",
       "The government",
       "A supplier of services"
      ],
      "a": 3,
      "why": "Subject of the rule: a supplier of services."
     },
     {
      "k": "mcq",
      "q": "How much notice is required?",
      "o": [
       "At least 30 days, in writing",
       "At most 30 days, in writing",
       "30 days, orally",
       "At least 3 days"
      ],
      "a": 0,
      "why": "At least = минимум; written notice."
     },
     {
      "k": "mcq",
      "q": "When does subsection (1) not apply?",
      "o": [
       "If the customer is angry",
       "If the supplier is very large",
       "Never",
       "If the increase is required by law"
      ],
      "a": 3,
      "why": "Subsection (2) — исключение."
     },
     {
      "k": "open",
      "q": "Restate subsection (3) in plain English.",
      "model": "If a supplier does not give the required notice, it cannot charge the higher price while the notice period is running.",
      "why": "Хорошее изложение: субъект + последствие + условие. Обратите внимание, что (3) — последствие неисполнения (1)."
     }
    ],
    "note": "Выдуманное положение для учебных целей. Это не настоящий закон."
   },
   {
    "id": "3.2",
    "title": "Facts, issue, rule and argument",
    "ru": "Факты, вопрос, норма и довод",
    "jur": [
     "INT"
    ],
    "intro": "Разделите историю на четыре типа высказываний.",
    "text": {
     "body": [
      "Dana bought a laptop from an online shop. The shop promised delivery by 1 June. The laptop arrived on 10 June.",
      "The contract says: “If the Seller delivers more than 7 days late, the Buyer may cancel.”",
      "Dana says that delivery was nine days late, so she may cancel.",
      "The Seller says that the delay was caused by a customs strike and that it is not liable."
     ],
     "ru": [
      "Дана купила ноутбук в интернет-магазине. Магазин обещал поставку до 1 июня. Ноутбук прибыл 10 июня.",
      "Договор говорит: «Если продавец поставляет товар с опозданием более чем на 7 дней, покупатель вправе отказаться от договора».",
      "Дана говорит, что поставка опоздала на девять дней, поэтому она вправе отказаться.",
      "Продавец говорит, что задержка вызвана забастовкой на таможне и что он не несёт ответственности."
     ]
    },
    "expr": [
     {
      "en": "promised delivery by",
      "ru": "обещал поставить до",
      "note": "Promise создаёт обязанность по договору."
     },
     {
      "en": "more than 7 days late",
      "ru": "с опозданием более чем на 7 дней",
      "note": "Пороговое условие в норме."
     },
     {
      "en": "may cancel",
      "ru": "вправе отказаться от договора",
      "note": "Право, а не обязанность."
     },
     {
      "en": "is not liable",
      "ru": "не несёт ответственности",
      "note": "Довод продавца о том, что он не отвечает."
     },
     {
      "en": "was caused by",
      "ru": "была вызвана",
      "note": "Утверждение о причине: его нужно доказать."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Which sentence is a fact?",
      "o": [
       "If the Seller delivers more than 7 days late, the Buyer may cancel.",
       "The laptop arrived on 10 June.",
       "The delay was caused by a customs strike.",
       "Dana may cancel the purchase."
      ],
      "a": 1,
      "why": "Факт — событие, которое произошло. Остальные: норма, довод продавца и вывод."
     },
     {
      "k": "mcq",
      "q": "Which sentence is the rule?",
      "o": [
       "Dana bought a laptop.",
       "The Seller is not liable.",
       "If the Seller delivers more than 7 days late, the Buyer may cancel.",
       "The laptop arrived on 10 June."
      ],
      "a": 2,
      "why": "Норма — условие и последствие, взятые из договора."
     },
     {
      "k": "mcq",
      "q": "What is the legal issue?",
      "o": [
       "Whether Dana may cancel the purchase because delivery was nine days late",
       "When the laptop was bought",
       "Which shop is the best",
       "Whether the customs strike was in the news"
      ],
      "a": 0,
      "why": "Issue — правовой вопрос, который нужно решить."
     },
     {
      "k": "mcq",
      "q": "The Seller’s statement about the customs strike is …",
      "o": [
       "an argument that still has to be proved and may or may not matter, depending on the contract and the applicable law",
       "a fact that settles the case",
       "a rule of the contract",
       "the court’s conclusion"
      ],
      "a": 0,
      "why": "Довод стороны ≠ факт. Повлияет ли забастовка на ответственность, зависит от договора и права (например, от пункта о force majeure)."
     }
    ],
    "note": "Выдуманная история. Результат реального спора зависит от условий договора и применимого права."
   },
   {
    "id": "3.3",
    "title": "Writing a short legal summary",
    "ru": "Краткое юридическое изложение",
    "jur": [
     "INT"
    ],
    "intro": "Сравните слабый и хороший вариант изложения.",
    "text": {
     "body": [
      "Weak: “Dana is unhappy. The shop is bad. She wants her money back.”",
      "Better: “Facts: The Seller promised delivery by 1 June. The laptop arrived on 10 June.",
      "Issue: Whether Dana may cancel the purchase.",
      "Rule: Under the contract, the Buyer may cancel if delivery is more than 7 days late.",
      "Application: Delivery was nine days late, which is more than 7 days. The Seller says the delay was caused by a customs strike, but the contract does not mention strikes.",
      "Conclusion (provisional): Dana appears to have a right to cancel. We should check whether the contract has a force majeure clause.”"
     ],
     "ru": [
      "Слабый вариант: «Дана недовольна. Магазин плохой. Она хочет вернуть деньги.»",
      "Лучше: «Факты: Продавец обещал поставку до 1 июня. Ноутбук прибыл 10 июня. Вопрос: Вправе ли Дана отказаться от покупки. Норма: По договору покупатель вправе отказаться, если поставка опоздала более чем на 7 дней. Применение: Поставка опоздала на девять дней, то есть более чем на 7. Продавец говорит, что задержка вызвана забастовкой на таможне, но договор забастовки не упоминает. Вывод (предварительный): У Даны, по-видимому, есть право отказаться. Нужно проверить, есть ли в договоре пункт о форс-мажоре.»"
     ]
    },
    "expr": [
     {
      "en": "appears to",
      "ru": "по-видимому",
      "note": "Осторожная формулировка предварительного вывода."
     },
     {
      "en": "provisional conclusion",
      "ru": "предварительный вывод",
      "note": "Вывод, который может измениться после проверки фактов и права."
     },
     {
      "en": "We should check whether",
      "ru": "Нам нужно проверить, …",
      "note": "Профессиональный способ указать, что остаётся неизвестным."
     },
     {
      "en": "the contract does not mention",
      "ru": "договор не упоминает",
      "note": "Нейтральное утверждение о тексте."
     },
     {
      "en": "Under the contract",
      "ru": "По договору",
      "note": "Указание источника нормы."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "What is wrong with the weak version?",
      "o": [
       "It is too long",
       "It uses the word Dana",
       "It gives feelings and opinions, not facts, the rule and the issue",
       "It has a conclusion that is too careful"
      ],
      "a": 2,
      "why": "Слабый вариант не называет факты, вопрос и норму."
     },
     {
      "k": "mcq",
      "q": "Why is the conclusion called “provisional”?",
      "o": [
       "Because the lawyer is not sure about English",
       "Because the case is in court",
       "Because Dana agrees",
       "Because some facts or the applicable law still have to be checked"
      ],
      "a": 3,
      "why": "Provisional = предварительный: нужно проверить пункт о force majeure."
     },
     {
      "k": "mcq",
      "q": "Which part of the summary explains how the rule works on the facts?",
      "o": [
       "Application",
       "Issue",
       "Facts",
       "Conclusion"
      ],
      "a": 0,
      "why": "Application = применение нормы к фактам."
     },
     {
      "k": "open",
      "q": "Write a one-sentence provisional conclusion for the laptop story.",
      "model": "Dana appears to have a right to cancel the purchase, subject to checking whether the contract contains a force majeure clause.",
      "why": "Subject to checking — полезная формула: вывод есть, но он зависит от непроверенного обстоятельства."
     }
    ],
    "note": "Образец для обучения. Не является юридической консультацией."
   },
   {
    "id": "3.4",
    "title": "Drafting a professional email",
    "ru": "Профессиональное электронное письмо",
    "jur": [
     "INT"
    ],
    "intro": "Ответ на просьбу и просьба продлить срок: вежливо, точно, со сроком.",
    "text": {
     "body": [
      "Subject: Re: Request for documents – Supply Agreement dated 1 September (ref. LS/2026/14)",
      "Dear Ms Sarsen,",
      "Thank you for your email of 8 October. I confirm that we received your request.",
      "We will send the invoice by 5 p.m. on Friday, 16 October. However, we need until Wednesday, 21 October to send the signed copy of the Agreement because the director is travelling.",
      "I would be grateful if you could confirm that this is acceptable.",
      "Kind regards,",
      "Omar Omarov"
     ],
     "ru": [
      "Тема: Re: Запрос документов – договор поставки от 1 сентября (исх. LS/2026/14)",
      "Уважаемая госпожа Сарсен,",
      "Благодарю за Ваше письмо от 8 октября. Подтверждаю получение Вашего запроса.",
      "Мы направим счёт до 17:00 в пятницу, 16 октября. Однако нам нужно время до среды, 21 октября, чтобы направить подписанный экземпляр договора, так как директор в командировке.",
      "Буду признателен, если Вы подтвердите, что это приемлемо.",
      "С уважением, Омар Омаров"
     ]
    },
    "expr": [
     {
      "en": "Thank you for your email of …",
      "ru": "Благодарю за Ваше письмо от …",
      "note": "Начало ответа: ссылка на предыдущее письмо."
     },
     {
      "en": "I confirm that …",
      "ru": "Подтверждаю, что …",
      "note": "Чёткое подтверждение."
     },
     {
      "en": "We will send … by …",
      "ru": "Мы направим … до …",
      "note": "Обещание со сроком."
     },
     {
      "en": "However, we need until …",
      "ru": "Однако нам нужно время до …",
      "note": "Вежливая просьба о продлении."
     },
     {
      "en": "I would be grateful if you could confirm",
      "ru": "Буду признателен, если Вы подтвердите",
      "note": "Вежливая просьба о подтверждении."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "What does the writer promise to send by 16 October?",
      "o": [
       "The signed copy of the Agreement",
       "The invoice",
       "A payment",
       "A new contract"
      ],
      "a": 1,
      "why": "The invoice — до 16 октября; подписанный экземпляр — до 21 октября."
     },
     {
      "k": "mcq",
      "q": "What does the writer ask the reader to do?",
      "o": [
       "To sign the Agreement",
       "To pay the invoice",
       "To confirm that the later date for the signed copy is acceptable",
       "To visit the office"
      ],
      "a": 2,
      "why": "I would be grateful if you could confirm that this is acceptable."
     },
     {
      "k": "mcq",
      "q": "Which sentence is the best opening for a reply?",
      "o": [
       "Hi!",
       "Got it.",
       "As I said before…",
       "Thank you for your email of 8 October."
      ],
      "a": 3,
      "why": "Ссылка на письмо и вежливый тон."
     },
     {
      "k": "open",
      "q": "Rewrite “We can’t do Friday for the signed copy” in a polite and precise way.",
      "model": "We would need until Wednesday, 21 October to send the signed copy. I would be grateful if you could confirm that this is acceptable.",
      "why": "Назовите документ, новую дату и вежливую просьбу о подтверждении."
     }
    ],
    "note": "Имена и компании выдуманы."
   },
   {
    "id": "3.5",
    "title": "A basic legal memorandum",
    "ru": "Базовый юридический меморандум",
    "jur": [
     "US",
     "INT"
    ],
    "intro": "Структура внутреннего документа с анализом правового вопроса (стиль американских меморандумов).",
    "text": {
     "body": [
      "MEMORANDUM",
      "To: Senior Partner. From: Trainee. Date: 12 October. Re: Dana – cancellation of laptop purchase",
      "Question Presented: May Dana cancel the purchase because delivery was nine days late?",
      "Brief Answer: Probably yes, because the contract allows cancellation if delivery is more than seven days late. This depends on whether the contract has a force majeure clause or other terms about delay.",
      "Facts: The Seller promised delivery by 1 June. The laptop arrived on 10 June. The Seller says a customs strike caused the delay.",
      "Analysis: Under the contract, the Buyer may cancel if delivery is more than 7 days late. Delivery was nine days late. The Seller’s strike argument matters only if the contract or the applicable law gives an excuse for such delay.",
      "Conclusion: Dana probably may cancel. We should review the full contract and the applicable law."
     ],
     "ru": [
      "МЕМОРАНДУМ",
      "Кому: старший партнёр. От: стажёр. Дата: 12 октября. Тема: Дана — отказ от покупки ноутбука",
      "Вопрос: Вправе ли Дана отказаться от покупки, так как поставка опоздала на девять дней?",
      "Краткий ответ: Вероятно, да, так как договор разрешает отказ при просрочке более семи дней. Это зависит от того, есть ли в договоре пункт о форс-мажоре или иные условия о задержке.",
      "Факты: Продавец обещал поставку до 1 июня. Ноутбук прибыл 10 июня. Продавец говорит, что задержку вызвала забастовка на таможне.",
      "Анализ: По договору покупатель вправе отказаться, если поставка опоздала более чем на 7 дней. Поставка опоздала на девять дней. Довод о забастовке важен, только если договор или применимое право предусматривают освобождение при такой задержке.",
      "Вывод: Дана, вероятно, вправе отказаться. Нужно изучить договор целиком и применимое право."
     ]
    },
    "expr": [
     {
      "en": "Question Presented",
      "ru": "Поставленный вопрос",
      "note": "Вопрос, который должен решить меморандум."
     },
     {
      "en": "Brief Answer",
      "ru": "Краткий ответ",
      "note": "Короткий вывод в начале: читатель сразу видит ответ."
     },
     {
      "en": "Probably yes",
      "ru": "Вероятно, да",
      "note": "Осторожная формулировка, если не все факты и нормы проверены."
     },
     {
      "en": "depends on whether",
      "ru": "зависит от того, …",
      "note": "Честное указание на неопределённость."
     },
     {
      "en": "Re:",
      "ru": "Тема:",
      "note": "Сокращение от in re — «по делу, по вопросу»."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Which section of the memorandum gives a short answer?",
      "o": [
       "Question Presented",
       "Facts",
       "Brief Answer",
       "Analysis"
      ],
      "a": 2,
      "why": "Brief Answer — короткий ответ в начале."
     },
     {
      "k": "mcq",
      "q": "Why does the Brief Answer say “probably”?",
      "o": [
       "Because the trainee does not know the facts",
       "Because Dana did not buy the laptop",
       "Because memoranda are never certain",
       "Because the contract and the applicable law still have to be reviewed"
      ],
      "a": 3,
      "why": "Вывод предварительный: нужно проверить пункт о форс-мажоре и применимое право."
     },
     {
      "k": "mcq",
      "q": "Which section explains how the rule applies to the facts?",
      "o": [
       "Heading",
       "Facts",
       "Conclusion",
       "Analysis"
      ],
      "a": 3,
      "why": "Analysis — применение нормы к фактам."
     },
     {
      "k": "open",
      "q": "Write a one-sentence Question Presented about this situation.",
      "model": "May Dana cancel the laptop purchase because delivery was nine days later than promised?",
      "why": "Хороший Question Presented — одно предложение, начинается с whether или may и включает ключевые факты."
     }
    ],
    "note": "Структура — один из распространённых вариантов (стиль США). В Англии и Уэльсе и в вашей организации заголовки могут быть другими."
   }
  ]
 },
 {
  "id": 4,
  "ready": true,
  "rev": 1,
  "title": "International and Commercial Law",
  "ru": "Международное и коммерческое право",
  "cefr": "ориентир: примерно B2–C1 (проектная модель LAWSTART, не сертификация CEFR)",
  "summary": "Международные коммерческие договоры, корпоративная лексика, арбитражные оговорки, трансграничные сделки, деловая переписка и переговоры.",
  "goals": [
   {
    "en": "Describe the main features of an international commercial contract and the choices the parties make.",
    "ru": "Описывать основные особенности международного коммерческого договора и выборы сторон."
   },
   {
    "en": "Use basic corporate terms: shareholder, director, board, authority, resolution.",
    "ru": "Использовать базовые корпоративные термины: акционер, директор, совет, полномочия, решение."
   },
   {
    "en": "Read an arbitration clause and identify the rules, the seat, the language and the number of arbitrators.",
    "ru": "Читать арбитражную оговорку и находить правила, место арбитража, язык и число арбитров."
   },
   {
    "en": "Understand the main checks in a cross-border transaction.",
    "ru": "Понимать основные проверки в трансграничной сделке."
   },
   {
    "en": "Write and read a formal notice and a reply, and use professional negotiation language.",
    "ru": "Писать и читать официальное уведомление и ответ, использовать язык деловых переговоров."
   }
  ],
  "concepts": [
   {
    "h": "International commercial contracts",
    "en": "An international (cross-border) commercial contract connects parties from different countries. Besides price and delivery, the parties usually decide: the governing law; how disputes will be resolved (courts or arbitration); the language of the contract and which language version prevails; the currency and method of payment; the delivery terms (often by reference to standard trade terms, such as Incoterms® rules of the International Chamber of Commerce); and compliance with laws such as export controls and sanctions. Each choice has legal effects that depend on the countries involved."
   },
   {
    "h": "Corporate legal terminology",
    "en": "A company is a legal person. It acts through people with authority. A shareholder (or member) owns shares in the company. A director is a person who helps manage the company; the board of directors takes major decisions. A resolution is a formal decision of a company body. The company’s constitution is called articles of association in the UK, articles (or certificate) of incorporation and bylaws in the US, and the charter (устав) in Kazakhstan. The forms and names of company bodies differ between countries."
   },
   {
    "h": "Arbitration clauses",
    "en": "Arbitration is a private way to resolve disputes: an arbitral tribunal of one or more arbitrators issues a final decision called an award. An arbitration clause usually says: which rules apply (often the rules of an arbitral institution); the seat of arbitration (the legal place of the arbitration, which affects the supervising courts and procedure); the number of arbitrators; the language. The seat is not the same as the place where hearings are held, and neither is the same as the governing law of the contract."
   },
   {
    "h": "Cross-border transactions",
    "en": "In a cross-border transaction each side should check who the counterparty is, who may sign, whether approvals or registrations are required, which documents must be translated or certified, which currency and payment method will be used, and whether sanctions or export controls apply. These checks are often called due diligence. Requirements depend on the countries and the type of transaction."
   },
   {
    "h": "Legal correspondence: notices and replies",
    "en": "A formal notice states the contract, the facts, the breach alleged, the requested action and the deadline, and usually reserves the sender’s rights. A reply acknowledges the notice, states the writer’s position and avoids admitting more than necessary. Phrases such as “without prejudice” and “subject to contract” come from English practice; their legal effect depends on the applicable law, so use them only when you understand them."
   },
   {
    "h": "Negotiation and professional communication",
    "en": "In negotiation, professionals reject politely, propose alternatives and make conditional offers: “We cannot accept this clause as drafted. Would you consider …?” “We could agree, subject to our client’s approval.” Be precise about what you offer and what is still open. Keep a respectful tone, even when you disagree."
   }
  ],
  "vocab": [
   {
    "t": "arbitration",
    "ru": "арбитраж (третейское разбирательство)",
    "def": "a private process in which one or more arbitrators decide a dispute and issue a final decision",
    "ex": "The parties agreed to resolve disputes by arbitration."
   },
   {
    "t": "arbitral tribunal",
    "ru": "арбитражный (третейский) суд, состав арбитров",
    "def": "the arbitrator or group of arbitrators who decide the dispute",
    "ex": "The tribunal consisted of three arbitrators."
   },
   {
    "t": "award",
    "ru": "арбитражное решение",
    "def": "the final decision of an arbitral tribunal",
    "ex": "The tribunal issued its award in June."
   },
   {
    "t": "seat of arbitration",
    "ru": "место (юридическое) арбитража",
    "def": "the legal place of an arbitration; it affects the procedure and the supervising courts",
    "ex": "The seat of arbitration is London."
   },
   {
    "t": "claimant / respondent",
    "ru": "истец / ответчик (в арбитраже)",
    "def": "the party that starts the arbitration / the party against which it is started",
    "ex": "The Claimant submitted a request for arbitration."
   },
   {
    "t": "shareholder",
    "ru": "акционер",
    "def": "a person or organisation that owns shares in a company",
    "ex": "The shareholders approved the merger."
   },
   {
    "t": "director",
    "ru": "директор, член совета директоров",
    "def": "a person who helps manage and represent a company",
    "ex": "The director signed the contract for the company."
   },
   {
    "t": "board of directors",
    "ru": "совет директоров",
    "def": "the group of directors that takes the main decisions for a company",
    "ex": "The board approved the Supply Agreement."
   },
   {
    "t": "resolution",
    "ru": "решение (органа компании)",
    "def": "a formal decision of a company body, such as the board or the shareholders",
    "ex": "The board adopted a resolution to enter into the agreement."
   },
   {
    "t": "authority (to sign)",
    "ru": "полномочия (на подписание)",
    "def": "the legal power to act and sign for a company",
    "ex": "Please confirm that Mr Smith has authority to sign."
   },
   {
    "t": "due diligence",
    "ru": "комплексная проверка (due diligence)",
    "def": "a careful check of a counterparty, a company or a transaction before a deal",
    "ex": "We completed due diligence on the supplier."
   },
   {
    "t": "counterparty",
    "ru": "контрагент",
    "def": "the other party to a transaction or contract",
    "ex": "We must verify the identity of our counterparty."
   },
   {
    "t": "sanctions",
    "ru": "санкции",
    "def": "legal restrictions on dealing with certain countries, persons or goods",
    "ex": "The contract requires both parties to comply with sanctions laws."
   },
   {
    "t": "without prejudice",
    "ru": "без ущерба для прав (в английской практике — режим переговоров)",
    "def": "a label used in England and Wales for settlement communications; its effect depends on the law and the facts",
    "ex": "This letter is written without prejudice to our client’s rights."
   },
   {
    "t": "subject to contract",
    "ru": "при условии заключения договора",
    "def": "a phrase showing that a proposal is not a final binding agreement until a contract is signed",
    "ex": "The offer is subject to contract."
   },
   {
    "t": "reserve the right",
    "ru": "оставлять за собой право",
    "def": "to state that you keep a right and may use it later",
    "ex": "We reserve the right to terminate the Agreement."
   }
  ],
  "texts": [],
  "speak": {
   "phrases": [
    {
     "en": "The seat of arbitration is London, and the language of the arbitration is English.",
     "ru": "Местом арбитража является Лондон, язык арбитража — английский."
    },
    {
     "en": "Please confirm that the person signing has authority to bind the company.",
     "ru": "Пожалуйста, подтвердите, что подписывающее лицо уполномочено связывать компанию."
    },
    {
     "en": "We cannot accept this clause as drafted. Would you consider an alternative?",
     "ru": "Мы не можем принять этот пункт в представленной редакции. Рассмотрите ли Вы альтернативу?"
    },
    {
     "en": "We could agree to that, subject to our client’s approval.",
     "ru": "Мы могли бы согласиться на это при условии одобрения нашего клиента."
    }
   ],
   "dialogue": {
    "title": "Dialogue: negotiating a liability cap",
    "lines": [
     {
      "who": "Lawyer A",
      "en": "We cannot accept a liability cap at fifty per cent of the price."
     },
     {
      "who": "Lawyer B",
      "en": "Would you consider a cap at one hundred per cent?"
     },
     {
      "who": "Lawyer A",
      "en": "We could agree to one hundred per cent for direct losses, subject to our client’s approval."
     },
     {
      "who": "Lawyer B",
      "en": "That is helpful. Could you confirm this in writing by Friday?"
     },
     {
      "who": "Lawyer A",
      "en": "Yes, I will send an email by five p.m. on Friday."
     }
    ]
   },
   "prompts": [
    {
     "q": "Explain the difference between governing law and the seat of arbitration.",
     "model": "Governing law is the law that applies to the contract. The seat is the legal place of the arbitration; it affects the procedure and which courts supervise it. They can be different."
    },
    {
     "q": "Politely reject a clause and propose an alternative. Say it aloud.",
     "model": "We cannot accept this clause as drafted. Would you consider a cap at the price paid?"
    }
   ]
  },
  "topics": [
   "international commercial contracts",
   "corporate legal terminology",
   "arbitration clauses",
   "cross-border transactions",
   "legal correspondence",
   "negotiation and professional communication"
  ],
  "terms": [
   {
    "t": "arbitration clause",
    "plain": "A contract clause in which the parties agree to resolve disputes by arbitration instead of state courts.",
    "ru": "арбитражная (третейская) оговорка",
    "jx": [
     {
      "j": "INT",
      "t": "Арбитражная оговорка обычно указывает правила, место арбитража (seat), число арбитров и язык. Институты, проводящие арбитраж, публикуют рекомендуемые формулировки; для реального договора используйте официальный образец выбранного института."
     },
     {
      "j": "EW",
      "t": "Арбитражные соглашения в Англии и Уэльсе регулируются законодательством об арбитраже; место арбитража в Англии и Уэльсе влияет на то, какие суды контролируют процесс."
     },
     {
      "j": "US",
      "t": "В США применяются федеральное и штатное право об арбитраже; детали зависят от дела."
     },
     {
      "j": "KZ",
      "t": "В Казахстане арбитраж (третейское разбирательство) регулируется отдельным законодательством; для международного арбитража проверяйте актуальные законы и международные договоры."
     }
    ],
    "ex": "Any dispute arising out of or in connection with this Agreement shall be finally resolved by arbitration.",
    "mistake": "Писать «arbitration court» как название суда. Arbitral tribunal — это не государственный суд, а частный состав арбитров.",
    "vs": "arbitration vs court litigation vs mediation: решение арбитров (обязательное), решение государственного суда, помощь посредника (без обязательного решения).",
    "task": {
     "q": "An arbitration clause usually …",
     "o": [
      "says that disputes will be decided by arbitrators, not by state courts",
      "chooses the price of the goods",
      "names the shareholders",
      "replaces the governing law clause"
     ],
     "a": 0,
     "why": "Arbitration clause заменяет суд арбитражем; это не то же самое, что governing law."
    }
   },
   {
    "t": "seat of arbitration",
    "plain": "The legal place of an arbitration. It affects the procedure and which courts supervise the arbitration.",
    "ru": "место (юридическое) арбитража",
    "jx": [
     {
      "j": "INT",
      "t": "Seat — юридическая привязка арбитража; он не обязан совпадать с местом заседаний. Также seat не равен governing law договора."
     },
     {
      "j": "EW",
      "t": "Если seat — Лондон, процесс связан с правом об арбитраже Англии и Уэльса и судами этой системы."
     },
     {
      "j": "US",
      "t": "Если seat — штат США, применяются правила этого штата и федеральное право."
     },
     {
      "j": "KZ",
      "t": "При выборе seat в иностранном месте проверьте, как казахстанское законодательство относится к такому выбору и к исполнению решения."
     }
    ],
    "ex": "The seat of arbitration shall be London, England.",
    "mistake": "Считать seat местом, где проходят слушания. Слушания могут проходить в другом городе или онлайн.",
    "vs": "seat vs venue (место заседаний) vs governing law (право договора).",
    "task": {
     "q": "“The seat of arbitration shall be London.” This means London is …",
     "o": [
      "always the place of every hearing",
      "the governing law of the contract",
      "the legal place of the arbitration",
      "the claimant’s address"
     ],
     "a": 2,
     "why": "Seat — юридическое место. Слушания могут проходить в другом месте."
    }
   },
   {
    "t": "award and enforcement",
    "plain": "An award is the final decision of an arbitral tribunal. Enforcement means making the losing party comply, using courts where needed.",
    "ru": "арбитражное решение и его принудительное исполнение",
    "jx": [
     {
      "j": "INT",
      "t": "Международные арбитражные решения часто исполняют на основании Конвенции ООН 1958 года о признании и приведении в исполнение иностранных арбитражных решений (Нью-Йоркская конвенция). Она действует между государствами, которые в ней участвуют; в каждом государстве есть собственные основания отказа. Проверяйте участие государств и местные правила."
     },
     {
      "j": "KZ",
      "t": "Для исполнения решения в Казахстане проверяйте актуальные законы и международные договоры, а также требования к документам."
     }
    ],
    "ex": "The Claimant seeks to enforce the award in the courts of the Respondent’s country.",
    "mistake": "Считать, что решение арбитража исполняется автоматически. Для принудительного исполнения часто нужно обращаться в суд.",
    "vs": "award (решение арбитров) vs judgment (решение суда).",
    "task": {
     "q": "An “award” is …",
     "o": [
      "a payment to the arbitrator",
      "a contract clause",
      "the final decision of an arbitral tribunal",
      "a court order to start the arbitration"
     ],
     "a": 2,
     "why": "Award = арбитражное решение. Judgment — решение государственного суда."
    }
   },
   {
    "t": "due diligence",
    "plain": "A careful check of a counterparty, a company or a transaction before a deal is made.",
    "ru": "комплексная проверка (due diligence)",
    "jx": [
     {
      "j": "INT",
      "t": "Due diligence может включать проверку личности контрагента, полномочий подписанта, лицензий и разрешений, споров и обременений имущества, а также соблюдения санкций. Объём зависит от сделки."
     },
     {
      "j": "US",
      "t": "В США термин широко используется при сделках M&A и в финансировании."
     },
     {
      "j": "EW",
      "t": "Термин используется так же; объём проверки определяется сделкой и рисками."
     }
    ],
    "ex": "We carried out due diligence on the counterparty before signing.",
    "mistake": "Считать due diligence однократной формальностью. Проверки нужно повторять, если обстоятельства меняются.",
    "vs": "due diligence vs audit: комплексная проверка перед сделкой vs проверка отчётности.",
    "task": {
     "q": "Why does a lawyer carry out due diligence before a deal?",
     "o": [
      "To avoid reading the contract",
      "To delay payment",
      "To check the counterparty and the risks before committing",
      "To choose the arbitrators"
     ],
     "a": 2,
     "why": "Due diligence помогает оценить риски до сделки."
    }
   },
   {
    "t": "without prejudice",
    "plain": "A label for communications made to try to settle a dispute. In England and Wales such communications are usually protected from being used in court as evidence, with exceptions.",
    "ru": "«без ущерба для прав» (режим переговоров об урегулировании)",
    "jx": [
     {
      "j": "EW",
      "t": "В Англии и Уэльсе without prejudice обычно защищает искренние попытки урегулирования спора; защита зависит от фактов и имеет исключения."
     },
     {
      "j": "US",
      "t": "В США схожие вопросы решают правила о доказательствах и урегулировании споров; не используйте метку без проверки местных правил."
     },
     {
      "j": "INT",
      "t": "В международной переписке без понимания права эта метка может создать ложное ощущение защиты. Не ставьте её механически."
     }
    ],
    "ex": "This letter is sent without prejudice to our client’s rights.",
    "mistake": "Использовать without prejudice автоматически, не зная, какое право применимо. Метка не гарантирует защиту.",
    "vs": "without prejudice vs subject to contract vs reservation of rights: режим переговоров, отсутствие обязательства до подписания, сохранение прав.",
    "task": {
     "q": "Which statement about “without prejudice” is the most careful?",
     "o": [
      "It always makes a letter secret",
      "It always ends the dispute",
      "It has the same effect in every country",
      "Its effect depends on the applicable law and the facts, so it should not be added mechanically"
     ],
     "a": 3,
     "why": "Эффект зависит от права и обстоятельств."
    }
   }
  ],
  "lessons": [
   {
    "id": "4.1",
    "title": "International commercial contracts: heads of terms",
    "ru": "Международные коммерческие договоры: основные условия",
    "jur": [
     "INT",
     "EW",
     "KZ"
    ],
    "intro": "Краткий перечень основных условий сделки между компаниями из разных стран.",
    "text": {
     "body": [
      "Heads of terms (summary of main points)",
      "Seller: Beta Supply Ltd (England). Buyer: Alpha Trading LLP (Kazakhstan).",
      "Goods: 100 office chairs. Price: EUR 50,000. Payment: within 30 days after delivery.",
      "Governing law: England and Wales. Disputes: arbitration, seat London.",
      "Language: English. If there is a Russian translation, the English version prevails.",
      "This summary is subject to contract and is not binding."
     ],
     "ru": [
      "Основные условия (краткое изложение)",
      "Продавец: Beta Supply Ltd (Англия). Покупатель: Alpha Trading LLP (Казахстан).",
      "Товар: 100 офисных кресел. Цена: 50 000 евро. Оплата: в течение 30 дней после поставки.",
      "Применимое право: право Англии и Уэльса. Споры: арбитраж, место арбитража — Лондон.",
      "Язык: английский. Если есть перевод на русский, приоритет имеет английская версия.",
      "Настоящее изложение подлежит заключению договора и не является обязательным."
     ]
    },
    "expr": [
     {
      "en": "heads of terms",
      "ru": "основные условия (предварительный документ)",
      "note": "Краткий документ с ключевыми условиями до подписания договора."
     },
     {
      "en": "prevails",
      "ru": "имеет приоритет",
      "note": "Если версии на разных языках расходятся, приоритет у указанной."
     },
     {
      "en": "subject to contract",
      "ru": "при условии заключения договора",
      "note": "Условие показывает, что окончательного обязательства ещё нет."
     },
     {
      "en": "is not binding",
      "ru": "не является обязательным",
      "note": "Документ не создаёт обязательств (если иное не оговорено)."
     },
     {
      "en": "seat London",
      "ru": "место арбитража — Лондон",
      "note": "Юридическое место арбитража."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Which law governs the contract?",
      "o": [
       "The law of Kazakhstan",
       "The law of London arbitration rules",
       "The law of England and Wales",
       "No law"
      ],
      "a": 2,
      "why": "Governing law: England and Wales."
     },
     {
      "k": "mcq",
      "q": "What is the seat of arbitration?",
      "o": [
       "Kazakhstan",
       "London",
       "England and Wales",
       "The Seller’s office"
      ],
      "a": 1,
      "why": "Seat London; не путайте с governing law."
     },
     {
      "k": "mcq",
      "q": "Which version prevails if there is a Russian translation?",
      "o": [
       "The Russian version",
       "Neither",
       "The shorter version",
       "The English version"
      ],
      "a": 3,
      "why": "The English version prevails."
     },
     {
      "k": "open",
      "q": "What does “This summary is subject to contract and is not binding” tell the reader?",
      "model": "The parties have not yet entered into a final contract, so the summary does not create binding obligations. The binding terms will be those in the signed contract.",
      "why": "Эта фраза защищает от ошибочного вывода, что договор уже заключён. Её эффект зависит от права; в тексте урока она используется как пример."
     }
    ],
    "note": "Образец с выдуманными компаниями. Это не рекомендация выбирать указанное право или место арбитража."
   },
   {
    "id": "4.2",
    "title": "Corporate legal terminology: a board resolution",
    "ru": "Корпоративная лексика: решение совета директоров",
    "jur": [
     "EW",
     "INT"
    ],
    "intro": "Кто принял решение и кому поручено подписать договор.",
    "text": {
     "body": [
      "Extract from the minutes of a meeting of the board of directors of Beta Supply Ltd held on 3 October.",
      "It was resolved that:",
      "(1) the company enter into the Supply Agreement with Alpha Trading LLP; and",
      "(2) Mr Smith, a director, is authorised to sign the Supply Agreement on behalf of the company."
     ],
     "ru": [
      "Выписка из протокола заседания совета директоров Beta Supply Ltd, состоявшегося 3 октября.",
      "Постановлено: (1) компании заключить договор поставки с Alpha Trading LLP; и (2) господину Смиту, директору, поручить подписание договора поставки от имени компании."
     ]
    },
    "expr": [
     {
      "en": "minutes",
      "ru": "протокол",
      "note": "Запись заседания."
     },
     {
      "en": "it was resolved that",
      "ru": "постановлено, что",
      "note": "Формула решения органа компании."
     },
     {
      "en": "is authorised to sign",
      "ru": "уполномочен подписать",
      "note": "Полномочия — основа действительной подписи от имени компании."
     },
     {
      "en": "on behalf of the company",
      "ru": "от имени компании",
      "note": "Подпись связывает компанию."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Which body took the decision?",
      "o": [
       "Alpha Trading LLP",
       "The board of directors of Beta Supply Ltd",
       "A court",
       "The shareholders of Alpha Trading LLP"
      ],
      "a": 1,
      "why": "Board of directors of Beta Supply Ltd."
     },
     {
      "k": "mcq",
      "q": "Who is authorised to sign the Supply Agreement?",
      "o": [
       "Any employee",
       "Mr Smith, a director",
       "Alpha Trading LLP",
       "The board as a group in person only"
      ],
      "a": 1,
      "why": "Resolution (2): Mr Smith is authorised."
     },
     {
      "k": "mcq",
      "q": "Why does a counterparty ask for evidence of authority?",
      "o": [
       "To change the price",
       "To avoid arbitration",
       "To choose the governing law",
       "To make sure that the person signing can bind the company"
      ],
      "a": 3,
      "why": "Authority — основа действительности подписи от имени компании."
     },
     {
      "k": "open",
      "q": "Explain “It was resolved that” in your own words.",
      "model": "It is a formal way to record that a company body (here the board) made a decision.",
      "why": "Resolution — формальное решение органа компании."
     }
    ],
    "note": "Выдуманная выписка. Формы протоколов и органы компаний различаются между странами."
   },
   {
    "id": "4.3",
    "title": "Arbitration clauses",
    "ru": "Арбитражные оговорки",
    "jur": [
     "INT",
     "EW"
    ],
    "intro": "Разберите оговорку: правила, место, состав и язык.",
    "text": {
     "body": [
      "Any dispute arising out of or in connection with this Agreement, including any question about its existence, validity or termination, shall be finally resolved by arbitration under the rules of [the arbitral institution] in force at the date of the request for arbitration.",
      "The tribunal shall consist of three arbitrators.",
      "The seat of arbitration shall be London, England.",
      "The language of the arbitration shall be English.",
      "This Agreement is governed by the laws of England and Wales."
     ],
     "ru": [
      "Любой спор, вытекающий из настоящего договора или связанный с ним, включая любой вопрос о его существовании, действительности или прекращении, окончательно разрешается арбитражем по правилам [арбитражного института], действующим на дату запроса об арбитраже.",
      "Трибунал состоит из трёх арбитров.",
      "Место арбитража — Лондон, Англия.",
      "Язык арбитража — английский.",
      "Настоящий договор регулируется правом Англии и Уэльса."
     ]
    },
    "expr": [
     {
      "en": "arising out of or in connection with",
      "ru": "вытекающий из или связанный с",
      "note": "Широкая формула охвата споров."
     },
     {
      "en": "finally resolved",
      "ru": "окончательно разрешается",
      "note": "Решение арбитров, как правило, окончательное."
     },
     {
      "en": "under the rules of",
      "ru": "по правилам",
      "note": "Институт и его правила называют в пункте."
     },
     {
      "en": "tribunal",
      "ru": "арбитражный трибунал (состав арбитров)",
      "note": "Орган, решающий спор."
     },
     {
      "en": "seat of arbitration",
      "ru": "место арбитража",
      "note": "Юридическое место."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "How many arbitrators decide the dispute?",
      "o": [
       "Three",
       "One",
       "Two",
       "It is not stated"
      ],
      "a": 0,
      "why": "The tribunal shall consist of three arbitrators."
     },
     {
      "k": "mcq",
      "q": "What is the language of the arbitration?",
      "o": [
       "Russian",
       "Kazakh",
       "The language of the winner",
       "English"
      ],
      "a": 3,
      "why": "The language of the arbitration shall be English."
     },
     {
      "k": "mcq",
      "q": "Does this clause choose a state court?",
      "o": [
       "Yes, the courts of London",
       "Yes, the courts of England and Wales",
       "Yes, any court",
       "No, it chooses arbitration"
      ],
      "a": 3,
      "why": "The clause provides for arbitration, not state court litigation."
     },
     {
      "k": "open",
      "q": "Explain how the seat of arbitration differs from the governing law in this clause.",
      "model": "The seat (London) is the legal place of the arbitration and affects procedure and supervising courts. The governing law (England and Wales) is the law that applies to the contract. They are chosen separately and can be different.",
      "why": "В реальном договоре используйте рекомендуемую формулировку выбранного арбитражного института; текст урока — учебный образец, а не готовая оговорка."
     }
    ],
    "note": "Учебный образец. Для реального договора используйте рекомендуемую формулировку выбранного арбитражного института и проконсультируйтесь с юристом."
   },
   {
    "id": "4.4",
    "title": "Cross-border transactions: checklist",
    "ru": "Трансграничные сделки: список проверок",
    "jur": [
     "INT"
    ],
    "intro": "Какие вопросы юрист проверяет до подписания.",
    "text": {
     "body": [
      "Subject: Before signing – checklist",
      "Dear colleagues,",
      "Before signing, please confirm:",
      "(1) the full legal name and registration number of the counterparty;",
      "(2) that the person signing has authority to sign;",
      "(3) whether any government approval or registration is required;",
      "(4) the payment currency and the bank details;",
      "(5) that neither party is subject to sanctions.",
      "Kind regards, Dana Sarsen"
     ],
     "ru": [
      "Тема: Перед подписанием – список проверок",
      "Уважаемые коллеги,",
      "Перед подписанием просим подтвердить: (1) полное наименование и регистрационный номер контрагента; (2) что подписывающее лицо уполномочено; (3) требуется ли разрешение или регистрация; (4) валюту платежа и банковские реквизиты; (5) что ни одна сторона не находится под санкциями.",
      "С уважением, Дана Сарсен"
     ]
    },
    "expr": [
     {
      "en": "full legal name",
      "ru": "полное юридическое наименование",
      "note": "Точное название и форма организации."
     },
     {
      "en": "registration number",
      "ru": "регистрационный номер",
      "note": "Идентификатор в государственном реестре."
     },
     {
      "en": "government approval",
      "ru": "разрешение государственного органа",
      "note": "Некоторые сделки требуют разрешений."
     },
     {
      "en": "bank details",
      "ru": "банковские реквизиты",
      "note": "Реквизиты нужно проверять независимо, чтобы избежать мошенничества."
     },
     {
      "en": "subject to sanctions",
      "ru": "находится под санкциями",
      "note": "Проверка нужна до сделки."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "Why does the lawyer ask for the registration number?",
      "o": [
       "To identify the counterparty exactly",
       "To change the price",
       "To choose the arbitrator",
       "To avoid reading the contract"
      ],
      "a": 0,
      "why": "Точная идентификация контрагента — часть due diligence."
     },
     {
      "k": "mcq",
      "q": "Which item is about authority?",
      "o": [
       "Item 1",
       "Item 2",
       "Item 4",
       "Item 5"
      ],
      "a": 1,
      "why": "Item 2: authority to sign."
     },
     {
      "k": "mcq",
      "q": "Why check sanctions before signing?",
      "o": [
       "Because sanctions decide the price",
       "Because arbitrators ask for it",
       "Because the contract language requires it",
       "Because dealing with a sanctioned party may be restricted or prohibited by law"
      ],
      "a": 3,
      "why": "Санкционные ограничения могут запрещать сделку; требования зависят от стран и сделки."
     },
     {
      "k": "open",
      "q": "Add one more useful check to the list and explain why.",
      "model": "For example: ‘whether any documents must be translated or certified’, because the other party or an authority may require an official translation. Another example: independently verifying bank details to avoid payment fraud.",
      "why": "Список примерный. Конкретные требования зависят от стран и вида сделки."
     }
    ],
    "note": "Образец списка проверок. Это не исчерпывающий перечень и не юридическая консультация."
   },
   {
    "id": "4.5",
    "title": "Legal correspondence: notice of breach and reply",
    "ru": "Деловая переписка: уведомление о нарушении и ответ",
    "jur": [
     "INT"
    ],
    "intro": "Официальное уведомление и осторожный ответ.",
    "text": {
     "body": [
      "Notice (from Alpha Trading LLP’s lawyer):",
      "Dear Mr Smith,",
      "Supply Agreement dated 1 September – Notice of breach",
      "We act for Alpha Trading LLP. Under clause 3.2, delivery was due by 30 November. The goods have not been delivered. In our view this is a breach of the Agreement.",
      "Please deliver the goods within 10 days of this letter. If you do not, our client reserves all its rights, including the right to terminate the Agreement and to claim damages.",
      "Yours sincerely,",
      "Reply (from Beta Supply Ltd):",
      "Dear Ms Sarsen,",
      "We acknowledge receipt of your letter. We are reviewing the matter and will reply by 15 December. Nothing in this letter is an admission of liability, and we reserve our position."
     ],
     "ru": [
      "Уведомление (от юриста Alpha Trading LLP): Уважаемый господин Смит, договор поставки от 1 сентября – уведомление о нарушении. Мы представляем Alpha Trading LLP. По пункту 3.2 поставка должна была состояться до 30 ноября. Товар не поставлен. По нашему мнению, это нарушение договора. Просим поставить товар в течение 10 дней с даты настоящего письма. Если этого не произойдёт, наш клиент сохраняет за собой все права, включая право прекратить договор и требовать возмещения убытков.",
      "Ответ (от Beta Supply Ltd): Уважаемая госпожа Сарсен, подтверждаем получение Вашего письма. Мы изучаем вопрос и ответим до 15 декабря. Ничто в настоящем письме не является признанием ответственности, и мы сохраняем нашу позицию."
     ]
    },
    "expr": [
     {
      "en": "We act for",
      "ru": "Мы представляем",
      "note": "Юрист действует от имени клиента."
     },
     {
      "en": "In our view",
      "ru": "По нашему мнению",
      "note": "Позиция юриста, а не установленный факт."
     },
     {
      "en": "reserves all its rights",
      "ru": "сохраняет за собой все права",
      "note": "Не отказывается от прав."
     },
     {
      "en": "acknowledge receipt",
      "ru": "подтверждаем получение",
      "note": "Подтверждение получения не означает согласия."
     },
     {
      "en": "an admission of liability",
      "ru": "признание ответственности",
      "note": "Ответ часто оговаривает, что признания нет."
     },
     {
      "en": "we reserve our position",
      "ru": "мы сохраняем нашу позицию",
      "note": "Не принимаем и не отвергаем окончательно."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "What does the notice ask Beta Supply Ltd to do?",
      "o": [
       "Pay damages immediately",
       "Sign a new contract",
       "Deliver the goods within 10 days of the letter",
       "Start arbitration"
      ],
      "a": 2,
      "why": "Please deliver the goods within 10 days."
     },
     {
      "k": "mcq",
      "q": "What does “reserves all its rights” mean?",
      "o": [
       "The sender terminates the contract today",
       "The sender gives up its rights",
       "The sender keeps its rights, such as to terminate and claim damages, and may use them later",
       "The sender admits the breach is minor"
      ],
      "a": 2,
      "why": "Reserve rights = сохранить права на будущее."
     },
     {
      "k": "mcq",
      "q": "In the reply, “Nothing in this letter is an admission of liability” means …",
      "o": [
       "the writer admits the breach",
       "the writer will pay damages",
       "the writer does not accept responsibility by writing this reply",
       "the writer terminates the contract"
      ],
      "a": 2,
      "why": "Типичная оговорка: ответ не должен быть истолкован как признание."
     },
     {
      "k": "open",
      "q": "Why does the notice say “In our view”?",
      "model": "Because the lawyer states the client’s position or opinion; whether there is a breach is for the parties or a court or tribunal to decide.",
      "why": "Фраза делает утверждение позицией, а не бесспорным фактом."
     }
    ],
    "note": "Выдуманная переписка. Формулировки уведомлений зависят от договора и права."
   },
   {
    "id": "4.6",
    "title": "Negotiation and professional communication",
    "ru": "Переговоры и профессиональное общение",
    "jur": [
     "INT"
    ],
    "intro": "Как отказывать вежливо, предлагать альтернативу и принимать условно.",
    "text": {
     "body": [
      "A: We cannot accept a liability cap at fifty per cent of the price.",
      "B: Would you consider a cap at one hundred per cent?",
      "A: We could agree to one hundred per cent for direct losses, subject to our client’s approval.",
      "B: That is helpful. Could you confirm this in writing by Friday?",
      "A: Yes, I will send an email by five p.m. on Friday."
     ],
     "ru": [
      "А: Мы не можем принять ограничение ответственности в размере пятидесяти процентов цены.",
      "Б: Рассмотрите ли Вы ограничение в размере ста процентов?",
      "А: Мы могли бы согласиться на сто процентов для прямых убытков при условии одобрения нашего клиента.",
      "Б: Это полезно. Не могли бы Вы подтвердить это письменно до пятницы?",
      "А: Да, я направлю письмо до 17:00 в пятницу."
     ]
    },
    "expr": [
     {
      "en": "We cannot accept …",
      "ru": "Мы не можем принять …",
      "note": "Вежливый, но ясный отказ."
     },
     {
      "en": "Would you consider …?",
      "ru": "Рассмотрите ли Вы …?",
      "note": "Вежливое предложение альтернативы."
     },
     {
      "en": "We could agree to … subject to …",
      "ru": "Мы могли бы согласиться … при условии …",
      "note": "Условное согласие."
     },
     {
      "en": "Could you confirm this in writing?",
      "ru": "Не могли бы Вы подтвердить это письменно?",
      "note": "Фиксация договорённости."
     }
    ],
    "tasks": [
     {
      "k": "mcq",
      "q": "What does A do in the first line?",
      "o": [
       "A accepts the proposal",
       "A rejects a proposal politely",
       "A threatens to end the talks",
       "A asks for a refund"
      ],
      "a": 1,
      "why": "We cannot accept … — отказ."
     },
     {
      "k": "mcq",
      "q": "What does B do in the second line?",
      "o": [
       "B refuses to talk",
       "B accepts at once",
       "B ends the contract",
       "B proposes an alternative"
      ],
      "a": 3,
      "why": "Would you consider …? — предложение альтернативы."
     },
     {
      "k": "mcq",
      "q": "Is A’s agreement in the third line final?",
      "o": [
       "No, it is subject to the client’s approval",
       "Yes, it is final",
       "No, it is a rejection",
       "Yes, it is binding on the client already"
      ],
      "a": 0,
      "why": "Subject to approval — условное согласие."
     },
     {
      "k": "open",
      "q": "Rewrite “No way” as a polite negotiation sentence.",
      "model": "We cannot accept this proposal as it stands. Would you consider an alternative?",
      "why": "Ясность + вежливость: отказ и предложение продолжить."
     }
    ],
    "note": "Выдуманный диалог для учебных целей."
   }
  ],
  "test": [
   {
    "q": "In an international commercial contract, a “governing law” clause decides …",
    "o": [
     "where the hearings take place",
     "who the arbitrators are",
     "the price of the goods",
     "which law applies to the contract"
    ],
    "a": 3,
    "why": "Governing law = применимое право. Место арбитража и состав — другие вопросы."
   },
   {
    "q": "“The seat of arbitration shall be London.” This means London is …",
    "o": [
     "always the place of every hearing",
     "the governing law",
     "the legal place of the arbitration",
     "the address of the Claimant"
    ],
    "a": 2,
    "why": "Seat — юридическое место арбитража."
   },
   {
    "q": "An “award” in arbitration is …",
    "o": [
     "a payment to the arbitrators",
     "a clause of the contract",
     "the final decision of the tribunal",
     "a request to start the arbitration"
    ],
    "a": 2,
    "why": "Award = арбитражное решение."
   },
   {
    "q": "Why does a lawyer check that the person signing has “authority”?",
    "o": [
     "To be sure that the person can bind the company",
     "To choose the governing law",
     "To set the price",
     "To avoid translating the contract"
    ],
    "a": 0,
    "why": "Authority = полномочия действовать за компанию."
   },
   {
    "q": "“It was resolved that the company enter into the Supply Agreement.” This sentence records …",
    "o": [
     "a payment",
     "a breach of contract",
     "a formal decision of a company body",
     "an arbitration award"
    ],
    "a": 2,
    "why": "Resolution — формальное решение органа компании."
   },
   {
    "q": "“Due diligence” means …",
    "o": [
     "a careful check of a counterparty or a transaction before a deal",
     "a deadline for payment",
     "a type of arbitration award",
     "a clause on termination"
    ],
    "a": 0,
    "why": "Due diligence = комплексная проверка."
   },
   {
    "q": "A letter says: “Our client reserves all its rights.” This means …",
    "o": [
     "the client gives up its rights",
     "the client terminates the contract now",
     "the client keeps its rights and may use them later",
     "the client admits liability"
    ],
    "a": 2,
    "why": "Reserve rights = сохранить права."
   },
   {
    "q": "“We could agree, subject to our client’s approval.” This is …",
    "o": [
     "a conditional agreement",
     "a final binding agreement",
     "a refusal",
     "an arbitration clause"
    ],
    "a": 0,
    "why": "Subject to approval = условное согласие."
   },
   {
    "q": "Which statement about “without prejudice” is the most careful?",
    "o": [
     "It always makes a letter secret",
     "It has the same effect in every country",
     "It ends the dispute",
     "Its effect depends on the applicable law and the facts"
    ],
    "a": 3,
    "why": "Эффект зависит от права и обстоятельств."
   },
   {
    "q": "“This summary is subject to contract and is not binding.” The reader should understand that …",
    "o": [
     "the contract was signed yesterday",
     "a final contract has not yet been made",
     "the summary creates all obligations",
     "the contract is void"
    ],
    "a": 1,
    "why": "Subject to contract = пока нет окончательного договора."
   },
   {
    "q": "Which sentence is a polite but clear rejection in a negotiation?",
    "o": [
     "We cannot accept this clause as drafted. Would you consider an alternative?",
     "No way.",
     "Whatever.",
     "That is stupid."
    ],
    "a": 0,
    "why": "Вежливый отказ + предложение продолжить."
   },
   {
    "q": "Which of these is usually NOT decided by an arbitration clause?",
    "o": [
     "The language of the arbitration",
     "The price of the goods",
     "The number of arbitrators",
     "The seat of arbitration"
    ],
    "a": 1,
    "why": "Цена товара определяется коммерческими условиями договора, а не арбитражной оговоркой."
   }
  ]
 }
];
/* Future levels: shown on the page only as an announcement, not as lessons. */
var LEC_FUTURE = [
 "Case-law analysis",
 "Oral presentations and moot court",
 "Preparation for international legal education (no guarantee of admission)"
];

/* ===== LAWSTART Legal English course: LOGIC (scoped to #lec) ===== */
(function(){
  var root=document.getElementById('lec');
  if(!root||typeof LEC_LEVELS==='undefined')return;
  var LV=LEC_LEVELS.filter(function(l){return l.ready});
  var PASS=LEC_PASS_PERCENT;
  var KEY='lawstart.legalEnglish.progress.v1';
  var corrupt=false,canStore=false,userNav=false,confirmReset=false,statusMsg='',stale=[];
  var view={name:'roadmap',idx:0,result:null};

  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined&&x!==null)e.textContent=x;return e}
  function en(t,c,x){var e=el(t,c,x);e.setAttribute('lang','en');return e}
  function isInt(n){return typeof n==='number'&&isFinite(n)&&Math.floor(n)===n}
  function isPass(score,total){return total>0&&score*100>=PASS*total}
  function pct(score,total){return total?Math.round(score*100/total):0}
  function has(o,k){return Object.prototype.hasOwnProperty.call(o,k)}

  /* ---- storage (versioned key, graceful failures) ---- */
  try{var k='__lec_probe';localStorage.setItem(k,'1');localStorage.removeItem(k);canStore=true}catch(e){canStore=false}
  function empty(){return {v:1,levels:{}}}
  /* a saved result belongs to one revision of a level's material (lv.rev); results saved without rev count as revision 1 */
  function entryRev(e){return (e&&typeof e==='object'&&isInt(e.rev))?e.rev:1}
  function validEntry(e,lv){
    return e&&typeof e==='object'&&isInt(e.best)&&isInt(e.total)&&isInt(e.attempts)&&e.total===lv.test.length&&e.best>=0&&e.best<=e.total&&e.attempts>=1&&e.attempts<=100000;
  }
  function load(){
    var raw=null;
    if(canStore){try{raw=localStorage.getItem(KEY)}catch(e){canStore=false}}
    if(raw===null||raw===undefined)return empty();
    try{
      var o=JSON.parse(raw);
      if(!o||typeof o!=='object'||o.v!==1||!o.levels||typeof o.levels!=='object'||Array.isArray(o.levels))throw new Error('shape');
      var out=empty();
      LV.forEach(function(lv){
        if(!has(o.levels,lv.id))return;
        var e=o.levels[lv.id];
        if(e&&typeof e==='object'&&entryRev(e)!==lv.rev){stale.push(lv.id);return}
        if(!validEntry(e,lv)){corrupt=true;return}
        out.levels[lv.id]={rev:lv.rev,best:e.best,total:e.total,attempts:e.attempts,last:(isInt(e.last)&&e.last>=0&&e.last<=e.total)?e.last:e.best};
      });
      return out;
    }catch(err){
      corrupt=true;
      try{localStorage.removeItem(KEY)}catch(e2){}
      return empty();
    }
  }
  var st=load();
  function save(){
    if(!canStore)return;
    try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){canStore=false}
  }
  function entry(lv){return has(st.levels,lv.id)?st.levels[lv.id]:null}
  function passed(lv){var e=entry(lv);return !!e&&isPass(e.best,e.total)}
  /* a level counts as passed only if every earlier level is passed too (guards against inconsistent saved data) */
  function cleared(i){for(var j=0;j<=i;j++){if(!passed(LV[j]))return false}return true}
  function unlocked(i){return i===0||cleared(i-1)}
  function doneCount(){var n=0;LV.forEach(function(l,i){if(cleared(i))n++});return n}

  /* ---- speech (browser text-to-speech only; no pronunciation scoring) ---- */
  var tts=false;
  try{tts=('speechSynthesis' in window)&&(typeof SpeechSynthesisUtterance!=='undefined')}catch(e){tts=false}
  var TTS_FAIL='Не удалось воспроизвести звук в этом браузере. Прочитайте фразу вслух самостоятельно.';
  var TTS_NONE='Озвучивание недоступно в этом браузере. Прочитайте фразы вслух самостоятельно: сайт не оценивает произношение.';
  function voice(){
    var vs=[];try{vs=window.speechSynthesis.getVoices()||[]}catch(e){}
    var i,pick=null;
    for(i=0;i<vs.length;i++){if(/^en[-_]GB/i.test(vs[i].lang)){pick=vs[i];break}}
    if(!pick)for(i=0;i<vs.length;i++){if(/^en/i.test(vs[i].lang)){pick=vs[i];break}}
    return pick;
  }
  function utter(text,msg){
    var u=new SpeechSynthesisUtterance(text);
    u.lang='en-GB';var v=voice();if(v){u.voice=v;u.lang=v.lang}
    u.rate=0.9;
    u.onerror=function(ev){if(!ev||(ev.error!=='canceled'&&ev.error!=='interrupted'))msg.textContent=TTS_FAIL};
    return u;
  }
  function say(texts,msg){
    msg.textContent='';
    if(!tts){msg.textContent=TTS_NONE;return}
    try{
      window.speechSynthesis.cancel();
      (Array.isArray(texts)?texts:[texts]).forEach(function(t){window.speechSynthesis.speak(utter(t,msg))});
    }catch(e){msg.textContent=TTS_FAIL}
  }
  function stopSpeech(){try{if(tts)window.speechSynthesis.cancel()}catch(e){}}
  function speakBtn(text,msg,label){
    var b=el('button','lec-sp','Прослушать');b.type='button';
    b.setAttribute('aria-label','Прослушать: '+(label||text));
    if(!tts){b.disabled=true}else{b.onclick=function(){say(text,msg)}}
    return b;
  }

  /* ---- builders ---- */
  function btn(text,cls,fn){var b=el('button','lec-btn'+(cls?' '+cls:''),text);b.type='button';if(fn)b.onclick=fn;return b}
  function badge(text,cls){return el('span','lec-st '+cls,text)}
  function status(lv,i){
    if(cleared(i))return {t:'✓ Пройден',c:'done',k:'done'};
    if(unlocked(i))return {t:'Доступен',c:'open',k:'open'};
    return {t:'🔒 Закрыт',c:'lock',k:'lock'};
  }
  function resultLine(lv){
    var e=entry(lv);
    if(!e)return 'Тест ещё не проходился.';
    return 'Лучший результат: '+e.best+' из '+e.total+' ('+pct(e.best,e.total)+'%) · попыток: '+e.attempts;
  }
  function go(name,idx,focusFn){
    userNav=true;stopSpeech();view.name=name;if(idx!==undefined)view.idx=idx;statusMsg='';render(focusFn);
  }
  function section(title,openByDefault){
    var d=el('details');if(openByDefault)d.open=true;
    d.appendChild(el('summary','',title));
    var b=el('div','lec-body');d.appendChild(b);return {d:d,b:b};
  }
  function radioQ(q,qi,name,onPick){
    var fs=el('fieldset','lec-q');
    var lg=el('legend','',(qi+1)+'. ');lg.appendChild(en('span','',q.q));lg.tabIndex=-1;fs.appendChild(lg);
    q.o.forEach(function(opt,k){
      var lb=el('label','lec-o');
      var r=document.createElement('input');r.type='radio';r.name=name;r.value=String(k);
      if(onPick)r.addEventListener('change',function(){onPick(k)});
      lb.appendChild(r);lb.appendChild(en('span','',opt));fs.appendChild(lb);
    });
    return {fs:fs,lg:lg};
  }

  /* ---- jurisdiction labels, term cards, lessons, practice tasks ---- */
  var JUR=(typeof LEC_JUR==='object'&&LEC_JUR)?LEC_JUR:{};
  var JUR_RU={US:'право США',EW:'право Англии и Уэльса',INT:'международная и трансграничная практика',KZ:'казахстанский контекст'};
  function jurChip(code){var c=el('span','lec-j j-'+code,JUR[code]||code);c.setAttribute('lang','en');return c}
  function jurLegend(){
    var p=el('p','lec-legend');p.appendChild(document.createTextNode('Метки правовой системы: '));
    ['US','EW','INT','KZ'].forEach(function(k,i){
      if(i)p.appendChild(document.createTextNode('; '));
      p.appendChild(jurChip(k));p.appendChild(document.createTextNode(' — '+JUR_RU[k]));
    });
    p.appendChild(document.createTextNode('. Метка показывает, к какой системе относится утверждение: определения и правила не универсальны.'));
    return p;
  }
  function practiceQ(qq,qi,name){
    var fb=el('p','lec-fb');fb.setAttribute('role','status');fb.setAttribute('aria-live','polite');
    var rq=radioQ(qq,qi,name,function(k){
      fb.className='lec-fb '+(k===qq.a?'ok':'no');
      fb.textContent=(k===qq.a?'✓ Верно. ':'✗ Неверно. Правильный ответ: '+qq.o[qq.a]+'. ')+'Объяснение: '+qq.why;
    });
    return [rq.fs,fb];
  }
  function openTask(t,qi,id){
    var box=el('div','lec-open');
    var lab=el('label','lec-olab',(qi+1)+'. ');lab.setAttribute('for',id+'-ta');lab.appendChild(en('span','',t.q));
    var ta=document.createElement('textarea');ta.id=id+'-ta';ta.rows=3;ta.className='lec-ta';
    var hint=el('p','lec-note','Напишите ответ своими словами (по желанию; он не сохраняется), затем сравните с образцом.');
    var ans=el('div','lec-ans');ans.id=id+'-ans';ans.hidden=true;
    ans.appendChild(en('p','lec-model','Model answer: '+t.model));
    if(t.why)ans.appendChild(el('p','lec-why','Объяснение: '+t.why));
    var b=btn('Показать образец ответа',null);b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls',id+'-ans');
    b.onclick=function(){var open=ans.hidden;ans.hidden=!open;b.textContent=open?'Скрыть образец ответа':'Показать образец ответа';b.setAttribute('aria-expanded',open?'true':'false')};
    box.appendChild(lab);box.appendChild(hint);box.appendChild(ta);box.appendChild(b);box.appendChild(ans);
    return box;
  }
  function termCard(tm,id){
    var d=el('details','lec-ls lec-tc');
    var su=el('summary','');su.appendChild(en('b','',tm.t));su.appendChild(el('span','lec-tr',' — '+tm.ru));d.appendChild(su);
    var b=el('div','lec-body');d.appendChild(b);
    var dl=el('dl','lec-dl');
    function row(label,node){var dt=en('dt','',label);var dd=el('dd');dd.appendChild(node);dl.appendChild(dt);dl.appendChild(dd)}
    row('Legal term',en('span','lec-big2',tm.t));
    row('Plain-English meaning',en('span','',tm.plain));
    row('Russian translation',el('span','',tm.ru));
    var jd=el('div');
    tm.jx.forEach(function(x){var p=el('p','lec-jx');p.appendChild(jurChip(x.j));p.appendChild(document.createTextNode(' '+x.t));jd.appendChild(p)});
    row('Legal context',jd);
    row('Example',en('span','',tm.ex));
    row('Common mistake',el('span','',tm.mistake));
    row('Compare with a close term',el('span','',tm.vs));
    var r=practiceQ(tm.task,0,id);var pd=el('div');pd.appendChild(r[0]);pd.appendChild(r[1]);
    row('Practical exercise',pd);
    b.appendChild(dl);
    return d;
  }
  function lessonBlock(ls,id){
    var d=el('details','lec-ls');
    var su=el('summary','');su.appendChild(document.createTextNode(ls.id+'. '));su.appendChild(en('span','',ls.title));su.appendChild(el('span','lec-tr',' — '+ls.ru));d.appendChild(su);
    var b=el('div','lec-body');d.appendChild(b);
    if(ls.jur&&ls.jur.length){var jp=el('p','lec-jrow');ls.jur.forEach(function(k){jp.appendChild(jurChip(k))});b.appendChild(jp)}
    if(ls.intro)b.appendChild(el('p','lec-note',ls.intro));
    b.appendChild(el('h5','lec-ct','Text / Текст'));
    var q=el('blockquote','lec-quote');ls.text.body.forEach(function(p){q.appendChild(en('p','',p))});b.appendChild(q);
    var tr=el('details','lec-trd');tr.appendChild(el('summary','','Перевод на русский / Translation'));
    var tb=el('div','lec-body');ls.text.ru.forEach(function(p){tb.appendChild(el('p','lec-ru2',p))});tr.appendChild(tb);b.appendChild(tr);
    b.appendChild(el('h5','lec-ct','Key expressions / Ключевые выражения'));
    var ul=el('ul','lec-expr');
    ls.expr.forEach(function(x){var li=el('li');li.appendChild(en('b','',x.en));li.appendChild(el('span','lec-tr',' — '+x.ru));if(x.note)li.appendChild(el('span','lec-xn',x.note));ul.appendChild(li)});
    b.appendChild(ul);
    b.appendChild(el('h5','lec-ct','Tasks / Задания'));
    ls.tasks.forEach(function(t,qi){
      if(t.k==='open'){b.appendChild(openTask(t,qi,id+'-'+qi))}
      else{var r=practiceQ(t,qi,id+'-'+qi);b.appendChild(r[0]);b.appendChild(r[1])}
    });
    if(ls.note)b.appendChild(el('p','lec-note',ls.note));
    return d;
  }

  /* ---- views ---- */
  function viewRoadmap(){
    var wrap=el('div');
    var h=el('h4','lec-h','Как устроен курс');h.tabIndex=-1;wrap.appendChild(h);
    var how=el('div','lec-card lec-how');
    var ex=LV.length?Math.ceil(LV[0].test.length*PASS/100)+' из '+LV[0].test.length:'';
    how.appendChild(el('p','','Учитесь по порядку: изучите уровень, пройдите итоговый тест и откройте следующий. Следующий уровень открывается только после результата не ниже '+PASS+'% (например, '+ex+').'));
    var ul=el('ul','plain');
    ['Каждый уровень построен по схеме Learn → Practice → Test → Progress: изучение (цели, объяснения, лексика, разбор терминов), практика (уроки с текстом, переводом и заданиями, тексты, устная практика), итоговый тест и сохранение результата с открытием следующего уровня.',
     'После теста вы видите результат в баллах и процентах и пояснения к ответам. Тест можно пересдавать.',
     'Прогресс хранится только в этом браузере на этом устройстве и не переносится на другие устройства. Сохраняются результаты итоговых тестов; ответы в упражнениях уроков не сохраняются. Личные данные не собираются.',
     'Уровни — проектная модель LAWSTART, а не сертификация CEFR. Прохождение курса не подтверждает уровень B2 или C1 и не гарантирует поступление в зарубежный вуз.',
     'Право разных стран не одинаково. Где это важно, материалы помечены: US Law (право США), England and Wales (право Англии и Уэльса), International / Cross-border (международная практика), Kazakhstan (казахстанский контекст). Спорные и зависящие от юрисдикции положения не представлены как универсальные.',
     'Это учебная проверка, а не экзамен под наблюдением: ответы на странице можно найти. Курс не заменяет IELTS, TOEFL, требования вузов и профессиональную юридическую квалификацию. Это не юридическая консультация. Учебные примеры договоров и писем выдуманы.'
    ].forEach(function(t){ul.appendChild(el('li','',t))});
    how.appendChild(ul);wrap.appendChild(how);

    var notices=[];
    if(stale.length)notices.push('Материалы уровней обновлены: '+stale.map(function(i){return String(i)}).join(', ')+'. Прежние результаты этих тестов относятся к старой версии материалов и не засчитываются. Пройдите тесты заново.');
    if(corrupt)notices.push('Часть сохранённого прогресса была повреждена и сброшена. Пройдите затронутые тесты заново.');
    if(!canStore)notices.push('Хранилище браузера недоступно (например, режим приватного просмотра или запрет сайтов). Прогресс сохранится только до закрытия или обновления этой страницы.');
    notices.forEach(function(n){var p=el('p','lec-warn',n);p.setAttribute('role','note');wrap.appendChild(p)});

    wrap.appendChild(el('p','lec-sum','Пройдено уровней: '+doneCount()+' из '+LV.length));
    var ol=el('ol','lec-levels');
    LV.forEach(function(lv,i){
      var s=status(lv,i);
      var li=el('li','lec-lv is-'+s.k);
      var top=el('div','lec-top');
      var t=el('h5','lec-lt');t.appendChild(document.createTextNode('Level '+lv.id+' — '));t.appendChild(en('span','',lv.title));top.appendChild(t);
      top.appendChild(badge(s.t,s.c));li.appendChild(top);
      li.appendChild(el('p','lec-ru',lv.ru+' · '+lv.cefr));
      li.appendChild(el('p','',lv.summary));
      li.appendChild(el('p','lec-res',resultLine(lv)));
      if(s.k==='lock'){
        li.appendChild(el('p','lec-lockmsg','Откроется после прохождения уровня '+LV[i-1].id+' с результатом не ниже '+PASS+'%.'));
        var lb=btn('Закрыто',null);lb.disabled=true;li.appendChild(lb);
      }else{
        li.appendChild(btn(s.k==='done'?'Повторить материалы или тест':'Открыть уровень','main',function(){if(unlocked(i))go('level',i)}));
      }
      ol.appendChild(li);
    });
    wrap.appendChild(ol);

    var fut=el('div','lec-card lec-future');
    fut.appendChild(el('h5','lec-lt','Будущие уровни: в разработке'));
    fut.appendChild(el('p','','Уроков и тестов для этих уровней пока нет. Они не входят в курс и не засчитываются:'));
    var fl=el('ul','plain');LEC_FUTURE.forEach(function(x){fl.appendChild(en('li','',x))});fut.appendChild(fl);
    wrap.appendChild(fut);

    var rs=el('div','lec-reset');
    if(!confirmReset){
      rs.appendChild(btn('Сбросить прогресс',null,function(){confirmReset=true;userNav=true;render(function(){return document.getElementById('lec-confirm')})}));
    }else{
      var cp=el('p','lec-confirm','Сбросить весь прогресс курса? Результаты тестов и открытые уровни будут удалены в этом браузере.');cp.id='lec-confirm';cp.tabIndex=-1;rs.appendChild(cp);
      var row=el('div','lec-row');
      row.appendChild(btn('Да, сбросить','main',function(){
        st=empty();corrupt=false;
        if(canStore){try{localStorage.removeItem(KEY)}catch(e){canStore=false}}
        confirmReset=false;statusMsg='Прогресс сброшен.';userNav=true;render(function(){return root.querySelector('.lec-h')});
      }));
      row.appendChild(btn('Отмена',null,function(){confirmReset=false;userNav=true;render(function(){return root.querySelector('.lec-reset button')})}));
      rs.appendChild(row);
    }
    wrap.appendChild(rs);
    return {node:wrap,focus:h};
  }

  function viewLevel(){
    var lv=LV[view.idx],i=view.idx;
    var wrap=el('div');
    wrap.appendChild(btn('← Все уровни',null,function(){go('roadmap')}));
    var h=el('h4','lec-h');h.tabIndex=-1;h.appendChild(document.createTextNode('Level '+lv.id+' — '));h.appendChild(en('span','',lv.title));wrap.appendChild(h);
    var s=status(lv,i);
    var meta=el('p','lec-meta');meta.appendChild(badge(s.t,s.c));meta.appendChild(document.createTextNode(' '+lv.ru+' · '+lv.cefr+'. '+resultLine(lv)));
    wrap.appendChild(meta);

    var nn=0;function T(kind,title){nn++;return kind+' · '+nn+'. '+title}
    var sec=section(T('Learn','Цели и темы уровня / Objectives and topics'),true);
    var gl=el('ul','plain');
    lv.goals.forEach(function(g){var li=el('li');li.appendChild(en('span','',g.en));li.appendChild(el('span','lec-tr',' — '+g.ru));gl.appendChild(li)});
    sec.b.appendChild(gl);
    if(lv.topics&&lv.topics.length){
      sec.b.appendChild(el('h5','lec-ct','Темы уровня / Topics'));
      var tl=el('ul','plain');lv.topics.forEach(function(x){tl.appendChild(en('li','',x))});sec.b.appendChild(tl);
    }
    wrap.appendChild(sec.d);

    sec=section(T('Learn','Объяснения / Explanations'),true);
    lv.concepts.forEach(function(c){
      var d=el('div','lec-con');d.appendChild(en('h5','lec-ct',c.h));d.appendChild(en('p','',c.en));sec.b.appendChild(d);
    });
    wrap.appendChild(sec.d);

    sec=section(T('Learn','Лексика / Vocabulary ('+lv.vocab.length+')'),false);
    var vm=el('p','lec-sp-msg');vm.setAttribute('role','status');vm.setAttribute('aria-live','polite');
    if(!tts)vm.textContent=TTS_NONE;
    sec.b.appendChild(vm);
    var vg=el('div','lec-vg');
    lv.vocab.forEach(function(v){
      var c=el('div','lec-v');
      var hd=el('div','lec-vh');hd.appendChild(en('b','',v.t));hd.appendChild(el('span','lec-tr',' — '+v.ru));c.appendChild(hd);
      c.appendChild(en('p','lec-def','Definition: '+v.def));
      c.appendChild(en('p','lec-ex','Example: '+v.ex));
      c.appendChild(speakBtn(v.t+'. '+v.ex,vm,v.t));
      vg.appendChild(c);
    });
    sec.b.appendChild(vg);wrap.appendChild(sec.d);

    if(lv.terms&&lv.terms.length){
      sec=section(T('Learn','Ключевые термины подробно / Key terms in depth ('+lv.terms.length+')'),false);
      sec.b.appendChild(jurLegend());
      lv.terms.forEach(function(tm,ti){sec.b.appendChild(termCard(tm,'lec-k'+lv.id+'-'+ti))});
      wrap.appendChild(sec.d);
    }

    if(lv.lessons&&lv.lessons.length){
      sec=section(T('Practice','Уроки: текст, перевод, разбор, задания / Lessons ('+lv.lessons.length+')'),false);
      sec.b.appendChild(el('p','lec-tr','Каждый урок: текст, перевод, ключевые выражения и задания с проверкой. Упражнения тренировочные: баллы не записываются и ответы не сохраняются.'));
      sec.b.appendChild(jurLegend());
      lv.lessons.forEach(function(ls,li2){sec.b.appendChild(lessonBlock(ls,'lec-l'+lv.id+'-'+li2))});
      wrap.appendChild(sec.d);
    }

    if(lv.texts&&lv.texts.length){
    sec=section(T('Practice','Тексты и упражнения / Reading and practice'),false);
    sec.b.appendChild(el('p','lec-tr','Упражнения здесь тренировочные: ответ проверяется сразу, баллы не записываются.'));
    lv.texts.forEach(function(tx,ti){
      var box=el('div','lec-text');
      box.appendChild(en('h5','lec-ct',tx.title));
      var q=el('blockquote','lec-quote');tx.body.forEach(function(p){q.appendChild(en('p','',p))});box.appendChild(q);
      if(tx.note)box.appendChild(el('p','lec-note',tx.note));
      tx.qs.forEach(function(qq,qi){
        var fb=el('p','lec-fb');fb.setAttribute('role','status');fb.setAttribute('aria-live','polite');
        var rq=radioQ(qq,qi,'lec-p'+lv.id+'-'+ti+'-'+qi,function(k){
          fb.className='lec-fb '+(k===qq.a?'ok':'no');
          fb.textContent=(k===qq.a?'✓ Верно. ':'✗ Неверно. Правильный ответ: '+qq.o[qq.a]+'. ')+qq.why;
        });
        box.appendChild(rq.fs);box.appendChild(fb);
      });
      sec.b.appendChild(box);
    });
    wrap.appendChild(sec.d);
    }

    sec=section(T('Practice','Устная практика / Speaking practice'),false);
    var sm=el('p','lec-sp-msg');sm.setAttribute('role','status');sm.setAttribute('aria-live','polite');
    sm.textContent=tts?'':TTS_NONE;
    sec.b.appendChild(el('p','lec-note','Нажмите «Прослушать», затем повторите фразу вслух. Используется встроенное озвучивание браузера. Сайт не записывает голос и не оценивает произношение.'));
    sec.b.appendChild(sm);
    sec.b.appendChild(el('h5','lec-ct','Repeat aloud / Повторите вслух'));
    var pl=el('ul','lec-phr');
    lv.speak.phrases.forEach(function(p){
      var li=el('li');li.appendChild(en('span','lec-en',p.en));li.appendChild(el('span','lec-tr',p.ru));li.appendChild(speakBtn(p.en,sm));pl.appendChild(li);
    });
    sec.b.appendChild(pl);
    sec.b.appendChild(en('h5','lec-ct',lv.speak.dialogue.title));
    var dl=el('ul','lec-phr');
    lv.speak.dialogue.lines.forEach(function(l){
      var li=el('li');var sp=en('span','lec-en');sp.appendChild(el('b','',l.who+': '));sp.appendChild(document.createTextNode(l.en));
      li.appendChild(sp);li.appendChild(speakBtn(l.en,sm));dl.appendChild(li);
    });
    sec.b.appendChild(dl);
    var allBtn=el('button','lec-sp lec-all','Прослушать весь диалог');allBtn.type='button';
    if(!tts)allBtn.disabled=true;else allBtn.onclick=function(){say(lv.speak.dialogue.lines.map(function(l){return l.en}),sm)};
    sec.b.appendChild(allBtn);
    sec.b.appendChild(el('h5','lec-ct','Oral response prompts / Ответьте вслух'));
    lv.speak.prompts.forEach(function(p){
      var d=el('details','lec-pr');var su=en('summary','',p.q);d.appendChild(su);
      var inner=el('div','lec-body');inner.appendChild(el('p','lec-note','Подумайте и ответьте вслух. Затем сравните с образцом.'));
      inner.appendChild(en('p','lec-model','Model answer: '+p.model));inner.appendChild(speakBtn(p.model,sm));d.appendChild(inner);sec.b.appendChild(d);
    });
    wrap.appendChild(sec.d);

    var tb=el('div','lec-card lec-start');
    tb.appendChild(el('h5','lec-lt','Test · '+(nn+1)+'. Итоговый тест / Final assessment'));
    tb.appendChild(el('p','','Вопросов: '+lv.test.length+'. Проходной результат: '+PASS+'% (не меньше '+Math.ceil(lv.test.length*PASS/100)+' из '+lv.test.length+').'));
    tb.appendChild(btn('Начать итоговый тест','main',function(){if(unlocked(i))go('test',i)}));
    wrap.appendChild(tb);
    return {node:wrap,focus:h};
  }

  function viewTest(){
    var lv=LV[view.idx];
    var wrap=el('div');
    wrap.appendChild(btn('← К материалам уровня',null,function(){go('level',view.idx)}));
    var h=el('h4','lec-h');h.tabIndex=-1;h.appendChild(document.createTextNode('Level '+lv.id+': итоговый тест'));wrap.appendChild(h);
    wrap.appendChild(el('p','','Выберите один ответ в каждом вопросе. Проходной результат: '+PASS+'% (не меньше '+Math.ceil(lv.test.length*PASS/100)+' из '+lv.test.length+'). Подсказки и ответы после проверки вы увидите вместе с результатом.'));
    var form=el('form','lec-form');form.setAttribute('novalidate','');
    var legs=[];
    lv.test.forEach(function(q,qi){var rq=radioQ(q,qi,'lec-t'+lv.id+'-'+qi);legs.push(rq);form.appendChild(rq.fs)});
    var msg=el('p','lec-warn');msg.setAttribute('role','alert');msg.hidden=true;form.appendChild(msg);
    var sb=btn('Проверить ответы','main');sb.type='submit';form.appendChild(sb);
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      if(!unlocked(view.idx))return;
      var ans=[],first=-1,miss=0;
      lv.test.forEach(function(q,qi){
        var c=form.querySelector('input[name="lec-t'+lv.id+'-'+qi+'"]:checked');
        if(c){ans.push(parseInt(c.value,10))}else{ans.push(-1);miss++;if(first<0)first=qi}
      });
      if(miss){msg.hidden=false;msg.textContent='Ответьте на все вопросы. Без ответа: '+miss+'.';legs[first].lg.focus();return}
      var score=0;lv.test.forEach(function(q,qi){if(ans[qi]===q.a)score++});
      var e=has(st.levels,lv.id)?st.levels[lv.id]:{best:0,total:lv.test.length,attempts:0,last:0};
      e.rev=lv.rev;e.attempts++;e.last=score;e.best=Math.max(e.best,score);e.total=lv.test.length;
      st.levels[lv.id]=e;save();
      view.result={score:score,total:lv.test.length,ans:ans,ok:isPass(score,lv.test.length)};
      go('result',view.idx);
    });
    wrap.appendChild(form);
    return {node:wrap,focus:h};
  }

  function viewResult(){
    var lv=LV[view.idx],r=view.result;
    var wrap=el('div');
    var h=el('h4','lec-h');h.tabIndex=-1;h.appendChild(document.createTextNode('Level '+lv.id+': результат'));wrap.appendChild(h);
    var box=el('div','lec-card lec-score '+(r.ok?'is-done':'is-fail'));
    box.appendChild(el('p','lec-big','Результат: '+r.score+' из '+r.total+' баллов ('+pct(r.score,r.total)+'%)'));
    box.appendChild(el('p','lec-verdict',r.ok?'✓ Тест пройден: уровень '+lv.id+' завершён.':'✗ Тест не пройден: нужно не менее '+PASS+'% (не меньше '+Math.ceil(r.total*PASS/100)+' из '+r.total+').'));
    var next=LV[view.idx+1];
    if(r.ok){
      box.appendChild(el('p','',next?'Следующий шаг: уровень '+next.id+' открыт. Переходите к нему.':'Вы прошли все доступные уровни. Новые уровни появятся позже; пока их уроков и тестов нет.'));
    }else{
      box.appendChild(el('p','','Следующий шаг: прочитайте пояснения ниже, повторите материалы уровня и пройдите тест ещё раз. Следующий уровень остаётся закрытым.'));
    }
    var row=el('div','lec-row');
    if(r.ok&&next)row.appendChild(btn('Перейти к уровню '+next.id,'main',function(){if(unlocked(view.idx+1))go('level',view.idx+1)}));
    row.appendChild(btn('Пройти тест ещё раз',r.ok&&next?null:'main',function(){go('test',view.idx)}));
    row.appendChild(btn('К материалам уровня',null,function(){go('level',view.idx)}));
    row.appendChild(btn('Все уровни',null,function(){go('roadmap')}));
    box.appendChild(row);wrap.appendChild(box);

    wrap.appendChild(el('h5','lec-ct','Разбор ответов'));
    var ol=el('ol','lec-rev');
    lv.test.forEach(function(q,qi){
      var good=r.ans[qi]===q.a;
      var li=el('li','lec-r '+(good?'ok':'no'));
      li.appendChild(en('p','lec-rq',q.q));
      li.appendChild(el('p','lec-rm',good?'✓ Верно':'✗ Неверно'));
      if(!good){var yp=el('p','');yp.appendChild(document.createTextNode('Ваш ответ: '));yp.appendChild(en('span','',q.o[r.ans[qi]]));li.appendChild(yp)}
      var cp=el('p','');cp.appendChild(document.createTextNode('Правильный ответ: '));cp.appendChild(en('span','',q.o[q.a]));li.appendChild(cp);
      li.appendChild(el('p','lec-why','Пояснение: '+q.why));
      ol.appendChild(li);
    });
    wrap.appendChild(ol);
    wrap.appendChild(el('p','lec-note','Учебная проверка, а не экзамен под наблюдением. Результат хранится только в этом браузере.'));
    return {node:wrap,focus:h};
  }

  function render(focusFn){
    root.textContent='';
    var v=view.name==='level'?viewLevel():view.name==='test'?viewTest():view.name==='result'?viewResult():viewRoadmap();
    var live=el('p','lec-live',statusMsg);live.setAttribute('role','status');live.setAttribute('aria-live','polite');
    root.appendChild(live);root.appendChild(v.node);
    if(userNav){
      var f=null;try{f=focusFn?focusFn():null}catch(e){f=null}
      (f||v.focus).focus();
    }
  }
  render();
})();
