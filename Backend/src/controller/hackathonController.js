import Hackathon from "../models/Hackathon.js";
import Team from "../models/Team.js";

export async function getAllHackathons(request, response) {
  try {
    const hackathon = await Hackathon.find();

    // response.status(200).send("");
    console.log(hackathon);
    response.status(200).json(hackathon);
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getHackathonById(request, response) {
  try {
    const id = request.params.id;
    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return response.status(404).json({ message: "Hackathon not found" });
    }

    return response.status(200).json(hackathon);
  } catch (error) {
    return response.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

// Update Hackathon
export async function updateHackathon(request, response) {
  try {
    const { id } = request.params;
    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return response.status(404).json({ message: "Hackathon not found" });
    }

    // Check authorization: only creator or ADMIN can update
    if (
      request.user &&
      hackathon.createdBy.toString() !== request.user.id &&
      request.user.role !== "ADMIN"
    ) {
      return response
        .status(403)
        .json({ message: "You are not authorized to update this hackathon" });
    }

    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      id,
      request.body,
      {
        new: true, // returns updated document
        runValidators: true, // validates fields before updating
      },
    );

    return response.status(200).json({
      message: "Hackathon updated successfully",
      hackathon: updatedHackathon,
    });
  } catch (error) {
    return response.status(500).json({ message: error.message || "Internal Server Error" });
  }
}
export async function searchHackathon(request, response) {
  try {
    const { search } = request.query;

    console.log("Search value:", search);

    if (!search) {
      return response.status(400).json({
        message: "Please provide a search value",
      });
    }

    const hackathons = await Hackathon.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { mode: { $regex: search, $options: "i" } },
      ],
    });

    return response.status(200).json(hackathons);
  } catch (error) {
    console.error("Search error:", error);

    return response.status(500).json({
      message: error.message,
    });
  }
}

export async function getTeamsByHackathon(request, response) {
  try {
    const teams = await Team.find({
      hackathonId: request.params.id,
    });

    return response.status(200).json(teams);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: error.message });
  }
}

export async function createHackathon(request, response) {
  try {
    let {
      title,
      description,
      organizer,
      location,
      mode,
      startDate,
      endDate,
      registrationDeadline,
      status,
      createdBy,
      createdAt,
    } = request.body;

    if (
      !title ||
      !description ||
      !organizer ||
      !location ||
      !mode ||
      !startDate ||
      !endDate ||
      !registrationDeadline ||
      !status
    ) {
      return response.status(400).json({ message: "All fields are required" });
    }

    if (
      new Date(startDate) >= new Date(endDate) ||
      new Date(registrationDeadline) > new Date(startDate)
    ) {
      return response.status(400).json({
        message: "Invalid hackathon Dates",
      });
    }
    const creatorId = request.user?.id || createdBy || "672a123456789abcdef12345";

    const hackathon = await Hackathon.create({
      title,
      description,
      organizer,
      location,
      mode: mode.toUpperCase(),
      startDate,
      endDate,
      registrationDeadline,
      status: status ? status.toUpperCase() : "UPCOMING",
      createdBy: creatorId,
    });

    return response.status(201).json({
      message: "Hackathon created successfully",
      hackathon,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: error.message });
  }
}

export async function deleteHackathon(request, response) {
  try {
    const { id } = request.params;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return response.status(404).json({ message: "Hackathon not found" });
    }

    // Check authorization: only creator or ADMIN can delete
    if (
      request.user &&
      hackathon.createdBy.toString() !== request.user.id &&
      request.user.role !== "ADMIN"
    ) {
      return response
        .status(403)
        .json({ message: "You are not authorized to delete this hackathon" });
    }

    await Hackathon.findByIdAndDelete(id);

    return response.status(200).json({
      message: "Hackathon deleted successfully",
    });
  } catch (error) {
    console.error("Delete hackathon error:", error);
    return response.status(500).json({ message: error.message });
  }
}
