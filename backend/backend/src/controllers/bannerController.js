const bannerService = require("../services/bannerServices");

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await bannerService.getAllBanners();
    res.status(200).json({ data: banners });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? `${req.file.filename}` : null;

    const banner = await bannerService.createBanner(title, image, description);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByIdBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await bannerService.getByIdBanner(id);
    res.status(200).json({ data: banner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const existingBanner = await bannerService.getByIdBanner(id);
    if (!existingBanner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    const image = req.file ? `${req.file.filename}` : existingBanner.image;
    const banner = await bannerService.updateBanner(
      id,
      title,
      image,
      description
    );
    res.status(200).json({ data: banner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await bannerService.deleteBanner(id);
    res.status(200).json({ status: true });
  } catch (error) {
    res.status(404).json({ status: false });
  }
};
