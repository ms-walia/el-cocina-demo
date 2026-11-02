/* El Cocina menu — the single source for the front-page card and the takeaway page.
   The five dishes marked "design" come from the El Cocina design file.
   Items marked placeholder: true were added to fill out each course — replace them with the real menu
   (names, descriptions and prices) before the site goes live. */
window.ELC_MENU = [
  { id: 'start', title: 'To start', items: [
    { id: 'burrata', name: 'Smoked Burrata, Blistered Tomato', desc: 'Cream set that morning, laid over tomatoes charred on open flame, basil oil pooling at the edge and a whisper of pink salt.', price: 690 },
    { id: 'sole',    name: 'Amritsari Sole, Reimagined',      desc: 'The batter you grew up on, lightened until it shatters. Ajwain, lime ash, a spoon of burnt-garlic emulsion beneath.', price: 850 },
    { id: 'broccoli', placeholder: true, name: 'Tandoori Broccoli, Almond Cream', desc: 'Charred in the clay oven, finished with a cool almond cream, chilli oil and toasted seeds.', price: 590 },
    { id: 'dahi',     placeholder: true, name: 'Dahi Ke Kebab, Pickled Onion',    desc: 'Hung-curd kebab with a crisp edge and a soft centre, mint chutney and quick-pickled red onion.', price: 640 }
  ]},
  { id: 'mains', title: 'Mains', items: [
    { id: 'lamb',     name: 'Clay-Oven Lamb Chops', desc: 'Twelve hours in hung curd and Kashmiri chilli, then four minutes over coal. Served pink, with burnt onion and cold mint.', price: 1240 },
    { id: 'khichdi',  name: 'Truffle Khichdi',      desc: 'The most humble bowl in the country, cooked slow in cultured butter and finished, unapologetically, with black truffle.', price: 780 },
    { id: 'butterchicken', placeholder: true, name: 'Charcoal Butter Chicken', desc: 'Chicken smoked over coal, a slow tomato and butter gravy, finished with kasuri methi and cream.', price: 920 },
    { id: 'lababdar',      placeholder: true, name: 'Paneer Lababdar, Charred Tomato', desc: 'Soft paneer in a rich onion and tomato gravy, charred tomato on the side, served with butter naan.', price: 780 }
  ]},
  { id: 'finish', title: 'To finish', items: [
    { id: 'chocolate', name: 'Dark Chocolate & Green Cardamom', desc: 'Seventy percent, barely set, warm at the centre. Cardamom cream, a crack of sea salt, one thin sheet of caramel.', price: 520 },
    { id: 'phirni', placeholder: true, name: 'Saffron Phirni, Pistachio Crumb', desc: 'Ground-rice custard set in a clay bowl, scented with saffron and rose, pistachio crumb on top.', price: 420 },
    { id: 'kulfi',  placeholder: true, name: 'Cardamom Kulfi, Candied Orange', desc: 'Slow-reduced milk, frozen dense and cold, with candied orange peel and a little pistachio.', price: 450 },
    { id: 'jamun',  placeholder: true, name: 'Gulab Jamun, Warm Rabri',        desc: 'Two warm jamun, rose syrup and a spoon of chilled rabri.', price: 480 }
  ]}
];

/* The bar card has no prices in the design, so it is shown on the front page only (not orderable). */
window.ELC_BAR = [
  { name: 'Old Fort', desc: 'Single malt under a dome of applewood smoke, jaggery, bitters aged in our own barrel. Lifted at the table.' },
  { name: 'Marble & Rose', desc: 'Gin washed with clarified milk until it turns to glass, rose from Kannauj, a long cold finish of white pepper.' },
  { name: 'Garden After Rain', tag: 'No alcohol', desc: 'Cucumber, green chilli, curry leaf and lime — the first cold hour after a Punjab monsoon, in a coupe.' },
  { name: 'Saffron Hour', tag: 'No alcohol', desc: 'Saffron steeped in cold honey, sharp citrus, salted soda. Gold in the glass, dry on the tongue.' }
];
