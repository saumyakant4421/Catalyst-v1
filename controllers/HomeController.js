const HomeData = require("../json/home.json");
const { Petition, Account } = require("../database/models/AccountModel.js");
const footerData = require("../json/footer.json");

const home = async (req, res) => {
  try {
    // Get analytics counts
    const users_counts = await Account.countDocuments() || 0;
    const petition_counts = await Petition.countDocuments() || 0;

    // Calculate total signatures
    const allPetitions = await Petition.find({}, 'supporters');
    const sign_counts = allPetitions.reduce((total, petition) => 
      total + (Array.isArray(petition.supporters) ? petition.supporters.length : 0), 0);

    // Fetch top 3 petitions with most supporters
    let featuredPetitions = await Petition.aggregate([
      {
        $addFields: {
          supporterCount: { $size: { $ifNull: ["$supporters", []] } }
        }
      },
      {
        $sort: { supporterCount: -1 }
      },
      { 
        $limit: 3
      }
    ]);

    // Populate creator information for the top petitions
    featuredPetitions = await Petition.populate(featuredPetitions, {
      path: 'creatorId',
      select: 'username'
    });

    // Process and sanitize petition data
    featuredPetitions = featuredPetitions.map(petition => ({
      _id: petition._id,
      title: petition.title || 'Untitled Petition',
      image: petition.image || '/default-petition-image.jpg',
      category: Array.isArray(petition.category) ? petition.category : [],
      supporterCount: petition.supporterCount || 0,
      targetSupporters: petition.targetSupporters || 100,
      author: petition.creatorId?.username || 'Anonymous',
      targetDate: petition.targetDate || null,
      description: petition.description || '',
      progress: Math.min(
        (petition.supporterCount || 0) / (petition.targetSupporters || 100) * 100,
        100
      ).toFixed(1)
    }));

    // Fetch user-created petitions if userId exists
    let userPetitions = [];
    if (req.session.userId) {
      userPetitions = await Petition.find({ creatorId: req.session.userId });
    }

    const data = {
      username: req.session.username,
      account: req.session.email,
      header: HomeData.header,
      templates: HomeData.templates,
      featuredPetitions,
      userPetitions,
      users_counts,
      sign_counts,
      petition_counts,
      footerData,
    };

    res.render("home", data);
  } catch (error) {
    console.error('Home page error:', error);
    
    const fallbackData = {
      username: req.session.username || "Guest",
      account: req.session.email || "",
      header: HomeData.header,
      templates: HomeData.templates,
      featuredPetitions: petitionsData.slice(0, 3), // Limit fallback data to 3 petitions
      userPetitions: [],
      users_counts: 0,
      sign_counts: 0,
      petition_counts: 0,
      footerData,
    };

    res.render("home", fallbackData);
  }
};

module.exports = {
  home,
};