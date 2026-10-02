const fs = require('fs');
const path = require('path');

const newDishes = [
  {
    "slug": "panda-express-grilled-teriyaki",
    "name": "Grilled Teriyaki Chicken",
    "metaTitle": "Panda Express Grilled Teriyaki Chicken: Calories & Nutrition",
    "metaDescription": "Panda Express Grilled Teriyaki Chicken guide. 300 calories, 33g protein. See full nutrition facts, healthy pairings, and discount tips.",
    "intro": "Grilled Teriyaki Chicken is a high-protein, low-calorie entree at Panda Express. It features grilled chicken thighs hand-sliced and served with a sweet and savory teriyaki sauce. You get a smoky flavor from the grill without the heavy batter found in other dishes.",
    "nutrition": {
      "servingSize": "1 Entree Serving",
      "calories": 300,
      "fat": 13,
      "saturatedFat": 4,
      "cholesterol": 115,
      "sodium": 530,
      "carbs": 14,
      "fiber": 0,
      "sugar": 9,
      "protein": 33
    },
    "isHealthy": {
      "headline": "Is Panda Express Grilled Teriyaki Chicken Healthy?",
      "content": "Grilled Teriyaki Chicken is one of the healthiest entrees on the menu. It packs 33 grams of protein for only 300 calories. Because the chicken is grilled instead of fried, it keeps total fat low. Be aware that the teriyaki sauce adds sugar and sodium. Ask for the sauce on the side if you want to control your sugar intake."
    },
    "howToOrderForLess": {
      "headline": "How to Order Grilled Teriyaki Chicken for Less",
      "tips": [
        "Use active coupon codes like PANDA20 online to save 20% on your entire plate.",
        "Order a Bigger Plate if you want leftovers. The extra entree costs about $2, giving you cheap protein for tomorrow.",
        "Scan your receipt for the guest survey to earn a free entree code for your next visit."
      ]
    },
    "orderingTips": [
      {
        "title": "Ask for Sauce on the Side",
        "detail": "Employees pour teriyaki sauce over the chicken by default. Ask them to put the sauce in a separate cup. This lets you dip the chicken and cut your sugar intake in half."
      },
      {
        "title": "Pair with Super Greens",
        "detail": "Combine this dish with Super Greens instead of Chow Mein. You create a meal with nearly 40 grams of protein and under 400 calories."
      },
      {
        "title": "Check the Grill Area",
        "detail": "This chicken takes longer to cook than wok dishes. If you see an empty pan, ask how long the wait is before you start your order."
      }
    ],
    "faq": [
      {
        "question": "How much protein is in Panda Express Grilled Teriyaki Chicken?",
        "answer": "A standard serving of Panda Express Grilled Teriyaki Chicken contains 33 grams of protein."
      },
      {
        "question": "Is the Teriyaki Chicken at Panda Express gluten-free?",
        "answer": "No. The chicken marinade and the teriyaki sauce both contain soy sauce, which is brewed with wheat."
      }
    ],
    "relatedDish": {
      "name": "String Bean Chicken",
      "url": "/panda-express-string-bean-chicken/",
      "tagline": "Looking for another healthy option? Check out the String Bean Chicken guide."
    }
  },
  {
    "slug": "panda-express-cream-cheese",
    "name": "Cream Cheese Rangoon",
    "metaTitle": "Panda Express Cream Cheese Rangoon: Calories & Nutrition",
    "metaDescription": "Panda Express Cream Cheese Rangoon guide. 190 calories per serving. See nutrition facts, ingredients, and how to get them cheaper.",
    "intro": "Cream Cheese Rangoon is a popular appetizer at Panda Express. It is a wonton wrapper filled with cream cheese and scallions, then deep-fried until crispy. Each order comes with three rangoons and a packet of sweet and sour sauce.",
    "nutrition": {
      "servingSize": "3 Rangoons",
      "calories": 190,
      "fat": 8,
      "saturatedFat": 5,
      "cholesterol": 20,
      "sodium": 180,
      "carbs": 24,
      "fiber": 1,
      "sugar": 1,
      "protein": 5
    },
    "isHealthy": {
      "headline": "Are Panda Express Cream Cheese Rangoons Healthy?",
      "content": "Cream Cheese Rangoons are a deep-fried appetizer and should be treated as a treat. A three-piece serving has 190 calories and 8 grams of fat. While the calorie count is relatively low, they offer very little nutritional value or protein. Eating them with sweet and sour sauce will also increase your sugar intake."
    },
    "howToOrderForLess": {
      "headline": "How to Save Money on Cream Cheese Rangoons",
      "tips": [
        "Use Panda Rewards. You can redeem 150 points for a free small appetizer, which includes a three-piece order of rangoons.",
        "Check for bundle deals. Sometimes family meals include appetizers at a discounted rate compared to buying them individually."
      ]
    },
    "orderingTips": [
      {
        "title": "Eat Them Fresh",
        "detail": "Rangoons lose their crunch quickly. Eat them immediately while they are still hot. If you get delivery, reheat them in an air fryer for two minutes to restore the crispy texture."
      },
      {
        "title": "Ask for Extra Sweet and Sour",
        "detail": "One packet of sweet and sour sauce is rarely enough for three rangoons. Ask the cashier for an extra packet before you pay."
      }
    ],
    "faq": [
      {
        "question": "Does Panda Express Cream Cheese Rangoon have crab?",
        "answer": "No. Panda Express Cream Cheese Rangoons contain only cream cheese and scallions. They do not contain imitation crab meat."
      },
      {
        "question": "How many calories are in Panda Express Cream Cheese Rangoon?",
        "answer": "A standard order of three Panda Express Cream Cheese Rangoons contains 190 calories."
      }
    ],
    "relatedDish": {
      "name": "Orange Chicken",
      "url": "/panda-express-orange-chicken/",
      "tagline": "Need a classic entree to go with your appetizer? Read our Orange Chicken guide."
    }
  },
  {
    "slug": "panda-express-black-pepper-steak",
    "name": "Black Pepper Angus Steak",
    "metaTitle": "Panda Express Black Pepper Angus Steak: Nutrition & Tips",
    "metaDescription": "Panda Express Black Pepper Angus Steak guide. 210 calories, 19g protein. Learn about this premium entree, nutrition facts, and how to save.",
    "intro": "Black Pepper Angus Steak is a premium wok-seared entree at Panda Express. It features thick slices of Angus steak tossed with baby broccoli, onions, red bell peppers, and mushrooms in a savory black pepper sauce. Because it uses higher-quality beef, it carries a premium upcharge.",
    "nutrition": {
      "servingSize": "1 Entree Serving",
      "calories": 210,
      "fat": 10,
      "saturatedFat": 2,
      "cholesterol": 40,
      "sodium": 560,
      "carbs": 13,
      "fiber": 2,
      "sugar": 5,
      "protein": 19
    },
    "isHealthy": {
      "headline": "Is Black Pepper Angus Steak Healthy?",
      "content": "Black Pepper Angus Steak is a great healthy choice. It delivers 19 grams of protein for just 210 calories. The dish includes multiple vegetables like broccoli and bell peppers, providing vitamins and fiber. The sodium level is moderate for fast food, but be aware that it costs extra due to the premium ingredients."
    },
    "howToOrderForLess": {
      "headline": "How to Avoid the Premium Upcharge",
      "tips": [
        "Use a percentage-off coupon. Codes like PANDA20 apply to your entire total, which offsets the extra $1.50 premium fee.",
        "Split a Bigger Plate. If you order a 3-entree plate, you only pay the premium upcharge once per premium item, making the overall cost-per-ounce lower."
      ]
    },
    "orderingTips": [
      {
        "title": "Check the Veggie-to-Meat Ratio",
        "detail": "Some servers scoop more vegetables than steak. Look at the pan before ordering. If it's mostly onions and broccoli, wait for a fresh batch so you get what you pay for."
      },
      {
        "title": "Pair with Chow Mein",
        "detail": "The rich black pepper sauce mixes perfectly with Chow Mein noodles. Ask the server to place the steak directly on top of the noodles so the sauce soaks in."
      }
    ],
    "faq": [
      {
        "question": "Is Black Pepper Angus Steak extra money?",
        "answer": "Yes. Black Pepper Angus Steak is a premium entree and typically costs an additional $1.50 or more per serving, depending on your location."
      },
      {
        "question": "How many calories are in Panda Express Black Pepper Angus Steak?",
        "answer": "A standard serving of Panda Express Black Pepper Angus Steak contains 210 calories and 19 grams of protein."
      }
    ],
    "relatedDish": {
      "name": "Beijing Beef",
      "url": "/beijing-beef/",
      "tagline": "Want a sweeter, crispy beef option? Read our Beijing Beef guide."
    }
  },
  {
    "slug": "panda-express-sweet-sour-chicken",
    "name": "Sweet & Sour Chicken Breast",
    "metaTitle": "Panda Express Sweet & Sour Chicken: Calories & Nutrition",
    "metaDescription": "Panda Express Sweet and Sour Chicken guide. 300 calories per serving. See nutrition info, allergy warnings, and how to get the best value.",
    "intro": "Sweet and Sour Chicken Breast features white-meat chicken chunks coated in a light batter and deep-fried. Unlike other entrees, the sweet and sour sauce is served on the side instead of wok-tossed. This keeps the chicken crispy until you are ready to eat.",
    "nutrition": {
      "servingSize": "1 Entree Serving",
      "calories": 300,
      "fat": 14,
      "saturatedFat": 2.5,
      "cholesterol": 40,
      "sodium": 260,
      "carbs": 40,
      "fiber": 1,
      "sugar": 24,
      "protein": 10
    },
    "isHealthy": {
      "headline": "Is Sweet and Sour Chicken Healthy?",
      "content": "Sweet and Sour Chicken has a high sugar content. While the chicken itself is only 300 calories, dipping it in the provided sauce adds significant sugar and calories. It provides 10 grams of protein, which is lower than dishes like Teriyaki Chicken. Eat this as an occasional treat rather than a post-workout protein source."
    },
    "howToOrderForLess": {
      "headline": "How to Order Sweet and Sour Chicken for Less",
      "tips": [
        "Order online and apply promo codes. Using codes during web checkout guarantees you get 20% off without arguing with a cashier.",
        "Save the extra sauce. The large sauce cups they provide can be kept in your fridge and used for home-cooked meals later."
      ]
    },
    "orderingTips": [
      {
        "title": "Ask for Fresh Chicken",
        "detail": "Because it isn't tossed in sauce, the chicken can dry out if it sits under the heat lamp too long. Politely ask if they have a fresh batch coming out."
      },
      {
        "title": "Mix with Hot Mustard",
        "detail": "Grab a packet of hot mustard and mix it into the sweet and sour sauce. This cuts the extreme sweetness and adds a sharp, spicy flavor profile."
      }
    ],
    "faq": [
      {
        "question": "Does Panda Express Sweet and Sour Chicken come with sauce?",
        "answer": "Yes. The chicken is served plain in the container, and the sweet and sour sauce is provided in a separate sealed cup on the side."
      },
      {
        "question": "How many calories are in Panda Express Sweet and Sour Chicken?",
        "answer": "The chicken pieces alone contain roughly 300 calories. Adding the sweet and sour sauce will increase the total calories and sugar significantly."
      }
    ],
    "relatedDish": {
      "name": "Orange Chicken",
      "url": "/panda-express-orange-chicken/",
      "tagline": "Want the sauce tossed in the wok? See the Orange Chicken nutrition guide."
    }
  },
  {
    "slug": "panda-express-string-bean-chicken",
    "name": "String Bean Chicken Breast",
    "metaTitle": "Panda Express String Bean Chicken: Calories & Nutrition",
    "metaDescription": "Panda Express String Bean Chicken Breast guide. 210 calories, 12g protein. Discover why this is one of the healthiest wok entrees.",
    "intro": "String Bean Chicken Breast is a light, wok-tossed dish. It combines sliced white-meat chicken breast, fresh string beans, and onions in a mild ginger soy sauce. It is a favorite for people looking for a vegetable-heavy, low-calorie meal.",
    "nutrition": {
      "servingSize": "1 Entree Serving",
      "calories": 210,
      "fat": 12,
      "saturatedFat": 2,
      "cholesterol": 25,
      "sodium": 590,
      "carbs": 13,
      "fiber": 2,
      "sugar": 5,
      "protein": 12
    },
    "isHealthy": {
      "headline": "Is String Bean Chicken Breast Healthy?",
      "content": "Yes. String Bean Chicken Breast is an excellent healthy choice. At only 210 calories and 12 grams of fat, it fits easily into most diets. It provides 12 grams of protein and uses unbattered chicken. The string beans add dietary fiber, making this dish both filling and nutritious."
    },
    "howToOrderForLess": {
      "headline": "How to Save on String Bean Chicken",
      "tips": [
        "Use the Panda Express app. Apply current promo codes in the app to reduce your total by up to 20%.",
        "Redeem a free entree. If you fill out the survey on the back of your receipt, you can get String Bean Chicken for free when you buy a Plate."
      ]
    },
    "orderingTips": [
      {
        "title": "Pair with Steamed White Rice",
        "detail": "Keep the meal completely clean by pairing it with steamed white rice instead of fried rice. This keeps your total fat low while providing clean energy."
      },
      {
        "title": "Watch the Bean-to-Chicken Ratio",
        "detail": "Make sure the server gives you an equal mix of chicken and green beans. Sometimes the scoop picks up mostly beans, so don't be afraid to ask for more chicken."
      }
    ],
    "faq": [
      {
        "question": "How many calories are in Panda Express String Bean Chicken Breast?",
        "answer": "A standard serving of Panda Express String Bean Chicken Breast contains 210 calories."
      },
      {
        "question": "Is Panda Express String Bean Chicken Breast spicy?",
        "answer": "No. The dish is cooked in a mild ginger soy sauce and contains no chili peppers or spicy ingredients."
      }
    ],
    "relatedDish": {
      "name": "Grilled Teriyaki Chicken",
      "url": "/panda-express-grilled-teriyaki/",
      "tagline": "Need more protein? View our Grilled Teriyaki Chicken guide."
    }
  },
  {
    "slug": "panda-express-chow-mein",
    "name": "Chow Mein",
    "metaTitle": "Panda Express Chow Mein: Calories, Nutrition & Tips",
    "metaDescription": "Panda Express Chow Mein guide. 510 calories per serving. See nutrition facts, ingredients, and how to order smart.",
    "intro": "Chow Mein is the most popular side dish at Panda Express. It consists of wheat noodles tossed in a wok with shredded cabbage, celery, and onions. The noodles are cooked in oil and soy sauce, giving them a distinct savory flavor and slightly chewy texture.",
    "nutrition": {
      "servingSize": "1 Side Serving",
      "calories": 510,
      "fat": 20,
      "saturatedFat": 3.5,
      "cholesterol": 0,
      "sodium": 860,
      "carbs": 74,
      "fiber": 6,
      "sugar": 9,
      "protein": 13
    },
    "isHealthy": {
      "headline": "Is Panda Express Chow Mein Healthy?",
      "content": "Chow Mein is a heavy carbohydrate source and is not considered a healthy diet staple. A standard serving contains 510 calories and 74 grams of carbs. It is cooked in a significant amount of oil, resulting in 20 grams of fat. If you want a healthier side, choose Super Greens instead."
    },
    "howToOrderForLess": {
      "headline": "How to Get the Best Value from Chow Mein",
      "tips": [
        "Order a large side for the family. A large box of Chow Mein costs around $5 but provides three full servings, making it a very cheap way to feed a group.",
        "Apply a coupon to a Family Meal. Using a code like FAMILY10 drops the price of a massive family meal, which includes two large sides like Chow Mein."
      ]
    },
    "orderingTips": [
      {
        "title": "Order Half and Half",
        "detail": "You do not have to commit to just noodles. Ask for \"half Chow Mein and half Fried Rice\" to get variety without paying an extra fee."
      },
      {
        "title": "Look for Fresh Batches",
        "detail": "Noodles dry out if they sit on the steam table. Order during peak lunch or dinner hours (12 PM or 6 PM) to ensure your Chow Mein is fresh, soft, and hot."
      }
    ],
    "faq": [
      {
        "question": "How many calories are in Panda Express Chow Mein?",
        "answer": "A standard serving of Panda Express Chow Mein contains 510 calories and 74 grams of carbohydrates."
      },
      {
        "question": "Is Panda Express Chow Mein vegan?",
        "answer": "Yes. The Chow Mein contains noodles, cabbage, celery, and onions. It does not contain any animal products, though it is cooked in a shared wok space."
      }
    ],
    "relatedDish": {
      "name": "Orange Chicken",
      "url": "/panda-express-orange-chicken/",
      "tagline": "Pair your noodles with a classic. Read the Orange Chicken guide."
    }
  }
];

const dishesPath = path.join(__dirname, 'data', 'dishes.json');
const currentDishes = JSON.parse(fs.readFileSync(dishesPath, 'utf8'));

// Filter out any existing to avoid duplicates if run multiple times
const existingSlugs = new Set(currentDishes.map(d => d.slug));
const toAdd = newDishes.filter(d => !existingSlugs.has(d.slug));

if (toAdd.length > 0) {
  currentDishes.push(...toAdd);
  fs.writeFileSync(dishesPath, JSON.stringify(currentDishes, null, 2), 'utf8');
  console.log('Added ' + toAdd.length + ' new dishes to data/dishes.json');
} else {
  console.log('Dishes already exist.');
}
