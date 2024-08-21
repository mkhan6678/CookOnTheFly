db = db.getSiblingDB('cookingData')
db.createCollection('ingredients')
cookCollection = db.getCollection("ingredients")
cookCollection.remove({})
cookCollection.insert(
    {
        ingredientId: 1,
        name: "potato",
        category: "vegetable"

    }
)
cookCollection.insert(
    {
        ingredientId: 2,
        name: "onion",
        category: "vegetable"
    }
)
cookCollection.insert(
    {
        ingredientId: 3,
        name: "chicken",
        category: "protein"
    }
)
cookCollection.insert(
    {
        ingredientId: 4,
        name: "rice",
        category: "grain"
    }
)
cookCollection.insert(
    {
        ingredientId: 5,
        name: "carrot",
        category: "vegetable"
    }
)
cookCollection.insert(
    {
        ingredientId: 6,
        name: "salmon",
        category: "protein"
    }
)
cookCollection.insert(
    {
        ingredientId: 7,
        name: "tomato",
        category: "vegetable"
    }
)
cookCollection.insert(
    {
        ingredientId: 8,
        name: "beef",
        category: "protein"
    }
)
cookCollection.insert(
    {
        ingredientId: 9,
        name: "broccoli",
        category: "vegetable"
    }
)
cookCollection.insert(
    {
        ingredientId: 10,
        name: "spaghetti",
        category: "grain"
    }
)
cookCollection.insert(
    {
        ingredientId: 11,
        name: "shrimp",
        category: "protein"
    }
)

db.createCollection('recipes')
recipesCollection = db.getCollection("recipes")
recipesCollection.remove({})
recipesCollection.insert(
    {
        recipeId: 1,
        name: "Beef broccoli",
        description: "1. Boil the broccoli.\n" +
            "2. Stir fry the broccoli.\n" +
            "3. Add beef and stir fry for another 3 min",
        ingredients: [8, 9],
        cuisine: "Chinese",
        dietaryRestrictions: [],
        createdByUserId: "103468366929518513340",
        savedByUserId:  ["106636286951372126097"],
        images: [
            "https://i1.wp.com/mamaloli.com/wp-content/uploads/2010/11/broccolibeef-12.jpg?fit=960%2C643&ssl=1",
            "https://2.bp.blogspot.com/-sl6TGZ0hYJk/TpshfRAG_-I/AAAAAAAAB70/6sAFo7v4zMM/s1600/beef-and-broccoli.jpg",
            "https://live.staticflickr.com/7528/27932366904_988b4afb20_b.jpg"
        ],
        premium: false,
        ratings: 3
    }
)
recipesCollection.insertOne(
    {
        recipeId: 2,
        name: "Chicken broccoli",
        description: "1. Boil the broccoli.\n" +
            "2. Stir fry the broccoli.\n" +
            "3. Add chicken and stir fry for another 10 min",
        ingredients: [3, 9],
        cuisine: "Chinese",
        dietaryRestrictions: [],
        createdByUserId: "",
        savedByUserId: [],
        images: [
            "https://images.pexels.com/photos/262973/pexels-photo-262973.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
            "https://static.pexels.com/photos/105588/pexels-photo-105588-portrait.jpeg"],
        premium: false,
        ratings: 4
    }
)
recipesCollection.insert(
    {
        recipeId: 3,
        name: "Chicken and Potatoes Casserole",
        description: "1. Cut potatoes, onions and tomatoes into slices and place in baking pan.\n" +
            "2. Cut chicken into quarters and lay on top of the tomatoes.\n" +
            "3. Bake in oven for 1 hour",
        ingredients: [1, 2, 3, 7],
        cuisine: "Egyptian",
        dietaryRestrictions: [],
        createdByUserId: "106636286951372126097",  //Aacer,
        savedByUserId:["103468366929518513340"],
        images: [
            "https://tatyanaseverydayfood.com/wp-content/uploads/2016/03/Creamy-Chicken-Potato-Casserole.jpg",
            "https://get.pxhere.com/photo/dish-meal-food-garlic-produce-eat-meat-lunch-cuisine-chicken-potato-cook-fried-spices-tomatoes-oil-roasting-frisch-dine-edible-chicken-meat-grilling-hendl-tandoori-chicken-oven-foods-1225385.jpg",
            "https://th.bing.com/th/id/OIP.os1bb2mYP1_Ejg_xiJDvdQHaEF?rs=1&pid=ImgDetMain"],
        premium: false,
        ratings: 3
    }
)

recipesCollection.insert(
    {
        recipeId: 4,
        name: "Tomato Shrimp Pasta",
        description: "1. Cook spaghetti in boiling water for 5 min.\n" +
            "2. Strain the pasta from the water and set aside.\n" +
            "3. Stir fry shrimp in sauce pan till cooked thoroughly.\n" +
            "4. Add the tomatoes to the shrimp and cook for another 1 min.\n" +
            "5. Add the spaghetti to the sauce pan and stir all ingredients together.",
        ingredients: [7, 10, 11],
        cuisine: "Italian",
        dietaryRestrictions: ["Pescetarian"],
        createdByUserId: "",
        savedByUserId: [],
        images: [
            "https://www.foodista.com/sites/default/files/styles/recype/public/ShrimpPasta4.jpg",
            "https://live.staticflickr.com/3577/3489907482_d632c70b38_b.jpg",
            "https://foodista.com/sites/default/files/shrimp%20pasta%20primavera%202%20copy.JPG",
            "https://upload.wikimedia.org/wikipedia/commons/f/fa/Egyptian_food_Pasta_with_Shrimp.jpg"

        ],
        premium: false,
        ratings: 3
    }
)


recipesCollection.insert(
    {
        recipeId: 5,
        name: "Vegetables Stew",
        description: "1. Mash tomatoes to create a tomato puree.\n" +
            "2. Cut potatoes, onions and carrots into slides and add to a baking pan.\n" +
            "3. Add tomato puree on top of the vegetables and add 1/2 cup of water.\n" +
            "4. Bake for 30 min.",
        ingredients: [1, 2, 5, 7],
        cuisine: "English",
        dietaryRestrictions: ["Vegan"],
        createdByUserId:"",
        savedByUserId: [],
        images: [
            "https://cloud.foodista.com/content/images/e0c6cde27e6661910128c673ada2ccffa7a300be_607x400.jpg",
            "https://4.bp.blogspot.com/-bckcQu_8YcE/ViEa8g6SutI/AAAAAAAACvw/v2pBI1NYsY8/s1600/stew1.jpg",
            "https://c.pxhere.com/photos/ba/2e/root_potato_hash_healthy_vegetable_vegetarian_vegan_sweet_potato-667328.jpg!d"
        ],
        premium: false,
        ratings: 2
    }
)


// Review Collection
db = db.getSiblingDB('cookingData')
db.createCollection('feedback')
feedbackCollection = db.getCollection("feedback")
//feedbackCollection.remove({})
feedbackCollection.insert(
    {
        recipeId: 1,
        feedbacks: [
            {
                feedbackId: 1,
                userId: 1,
                comment: "Delicious! Loved the flavors. ",
                ratings: "5"
            },
            {
                feedbackId: 2,
                userId: 2,
                comment: "Quick and easy recipe. Perfect for busy weeknights.",
                ratings: 5,
            },
            {
                feedbackId: 3,
                userId: 3,
                comment: "Looks and sounds wonderful! Will make it tonight.",
                ratings: 5,
            },
            {
                feedbackId: 4,
                userId: 4,
                comment: "I added sliced cherry tomatoes, flat italian parsley and basil. It adds more flavours",
                ratings: 4,
            },
            {
                feedbackId: 5,
                userId: 5,
                comment: "Yes, I added different vegetables(zuchinni,yellow squash, red, yellow, orange, and green peppers). I added a can of fire roasted tomatoes, used pre-cooked shrimp and it came out very delicious!!",
                ratings: 4,
            },
        ]
    }
)

feedbackCollection.insert(
    {
        recipeId: 2,
        feedbacks: [
            {
                feedbackId: 1,
                userId: 1,
                comment: "This recipe is good that i have to heave every sunday!",
                ratings: "5"
            },
            {
                feedbackId: 2,
                userId: 2,
                comment: "Terrific base recipe. Needs to be tweaked with more of everything and few extras and came out great. Again, great base recipe.",
                ratings: 5,
            },
            {
                feedbackId: 3,
                userId: 3,
                comment: "Absolutely amazing. After reading other comments, I didn't add the lemon. Thank you for sharing!",
                ratings: 5,
            },
            {
                feedbackId: 4,
                userId: 4,
                comment: "Love it, my friends loved it too! Made it twice",
                ratings: 4,
            },
            {
                feedbackId: 5,
                userId: 5,
                comment: "Love This recipe!! Thank you for sharing",
                ratings: 4,
            },
        ]
    }
)

feedbackCollection.insert(
    {
        recipeId: 3,
        feedbacks: [
            {
                feedbackId: 1,
                userId: 1,
                comment: "Delicious, refreshing and satisfying. This made my day amazing.",
                ratings: 5,
            },
            {
                feedbackId: 2,
                userId: 2,
                comment: "I did not use the heavy cream nor sugar as my mangoes are sweet already... It was divine!",
                ratings: 5,
            },
            {
                feedbackId: 3,
                userId: 3,
                comment: "With a few adjustments, this was a great smoothie. Definitely didn't need sugar, it was way sweet without it! Also used all frozen fruit so I didn't add ice. The basil was an interesting (and delicious!) addition. Will make again without sugar.",
                ratings: 5,
            },
            {
                feedbackId: 4,
                userId: 4,
                comment: "I think it was great but in my opinion use less water!",
                ratings: 4,
            },
            {
                feedbackId: 5,
                userId: 5,
                comment: "I changed the ingredients I have, it turns out a delicious. I will post the receipies",
                ratings: 4,
            },
        ]
    }
)

feedbackCollection.insert(
    {
        recipeId: 4,
        feedbacks: [
            {
                feedbackId: 1,
                userId: 1,
                comment: "Absolutely greatEasy, healthy and quick",
                ratings: 5,
            },
            {
                feedbackId: 2,
                userId: 2,
                comment: "I made them just as written and liked them a lot. They had a nice crispy outside and a light creamy texture inside. The taste was wonderfully fresh",
                ratings: 4,
            },
            {
                feedbackId: 3,
                userId: 3,
                comment: "Loved these and can't wait to make them again.",
                ratings: 5,
            },
            {
                feedbackId: 4,
                userId: 4,
                comment: "I added onion and garlic powder, jalapeño. I cooked them in the air fryer. No oil. So yummy",
                ratings: 4,
            },
            {
                feedbackId: 5,
                userId: 5,
                comment: "I added some spinach. That’s all. Thanks delicious",
                ratings: 3,
            },
        ]
    }
)

feedbackCollection.insert(
    {
        recipeId: 5,
        feedbacks: [
            {
                feedbackId: 1,
                userId: 1,
                comment: "I made this on a whim, thinking I could make it gluten free. It worked beautifully!",
                ratings: 5,
            },
            {
                feedbackId: 2,
                userId: 2,
                comment: "Had it for Thanksgiving. It was amazing! Didn't change a thing. Definitely a keeper as everyone wanted the recipe.",
                ratings: 5,
            },
            {
                feedbackId: 3,
                userId: 3,
                comment: "I found that the carrot cake base was too dense for me, and it tasted good, but it needed tweaking.",
                ratings: 4,
            },
            {
                feedbackId: 4,
                userId: 4,
                comment: "Despite being in the oven for 1 h 25 min, the carrot cake was unbaked. I made no substitutions and followed the recipe prep exactly as provided.",
                ratings: 2,
            },
            {
                feedbackId: 5,
                userId: 5,
                comment: "I appreciated the comments made and used some of them to alter the recipe. ",
                ratings: 4,
            },
        ]
    }
)

