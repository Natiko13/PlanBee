const { User } = require("../models")

const createGroup = async (req, res) => {
	const { groupName = "Nazwa grupy", collaboratorEmails = [] } = req.body

	try {
		const currentUser = await User.findById(req.user._id)

		if (collaboratorEmails.includes(currentUser.email)) {
			return res.status(400).json({
				error: "You cannot add yourself to the group using collaboratorEmails.",
			})
		}

		let notFoundEmails = []
		for (let email of collaboratorEmails) {
			const collaboratorUser = await User.findOne({ email })
			if (!collaboratorUser) {
				notFoundEmails.push(email)
			}
		}

		if (notFoundEmails.length > 0) {
			return res.status(404).json({
				error:
					"Following collaborator emails not found: " +
					notFoundEmails.join(", "),
			})
		}

		const group = {
			name: groupName,
			members: [currentUser.email, ...collaboratorEmails],
			notes: [],
			tasks: [],
		}

		currentUser.groups.push(group)
		await currentUser.save()

		for (let email of collaboratorEmails) {
			const collaboratorUser = await User.findOne({ email })
			collaboratorUser.groups.push(group)
			await collaboratorUser.save()
		}

		res.status(201).json({
			name: currentUser.name,
			surname: currentUser.surname,
			email: currentUser.email,
			notes: currentUser.notes,
			calendar: currentUser.calendar,
			groups: currentUser.groups,
			profileOptions: currentUser.profileOptions,
		})
	} catch (error) {
		console.error("Error occurred while creating group:", error)
		res.status(500).json({ error: "Error occurred while creating group." })
	}
}

const updateGroupName = async (req, res) => {
	const { groupId, newName } = req.body

	try {
		const currentUser = await User.findById(req.user._id)
		const group = currentUser.groups.id(groupId)

		if (!group) {
			return res.status(404).json({ error: "Group not found." })
		}

		group.name = newName
		await currentUser.save()

		for (let email of group.members) {
			const memberUser = await User.findOne({ email })
			if (memberUser) {
				const memberGroup = memberUser.groups.id(groupId)
				if (memberGroup) {
					memberGroup.name = newName
					await memberUser.save()
				}
			}
		}

		res.status(200).json({
			name: currentUser.name,
			surname: currentUser.surname,
			email: currentUser.email,
			notes: currentUser.notes,
			calendar: currentUser.calendar,
			groups: currentUser.groups,
			profileOptions: currentUser.profileOptions,
		})
	} catch (error) {
		console.error("Error occurred while updating group name:", error)
		res.status(500).json({ error: "Error occurred while updating group name." })
	}
}

const checkEmailExistence = async (req, res) => {
	const { email } = req.params

	if (!email) {
		return res.status(400).json({ error: "Email parameter is missing." })
	}

	const user = await User.findOne({ email })

	if (!user) {
		return res.status(404).json({ error: email })
	}

	return res.status(200).json({ success: `Email ${email} exists.` })
}

const addMembersToGroup = async (req, res) => {
	const { groupId, newMembers = [] } = req.body

	try {
		if (!req.user || !req.user._id) {
			return res.status(400).json({ error: "User ID is missing or invalid." })
		}

		const currentUser = await User.findById(req.user._id)

		if (!currentUser) {
			return res.status(404).json({ error: "Current user not found." })
		}

		const group = currentUser.groups.id(groupId)

		if (!group) {
			return res.status(404).json({ error: "Group not found." })
		}

		let notFoundEmails = []
		for (let email of newMembers) {
			const collaboratorUser = await User.findOne({ email })
			if (!collaboratorUser) {
				notFoundEmails.push(email)
			}
		}

		if (notFoundEmails.length > 0) {
			return res.status(404).json({
				error:
					"Following member emails not found: " + notFoundEmails.join(", "),
			})
		}

		for (let email of newMembers) {
			if (!group.members.includes(email)) {
				group.members.addToSet(email)

				const collaboratorUser = await User.findOne({ email })

				if (collaboratorUser) {
					collaboratorUser.groups.addToSet(group)
					await collaboratorUser.save()
				}
			}
		}

		await currentUser.save()

		for (let email of group.members) {
			const memberUser = await User.findOne({ email })

			if (memberUser) {
				const memberGroup = memberUser.groups.id(groupId)

				if (memberGroup) {
					memberGroup.members = group.members
					await memberUser.save()
				} else {
					console.warn(`Group with ID ${groupId} not found for user ${email}.`)
				}
			} else {
				console.warn(`User with email ${email} not found.`)
			}
		}

		res.status(200).json({
			name: currentUser.name,
			surname: currentUser.surname,
			email: currentUser.email,
			notes: currentUser.notes,
			calendar: currentUser.calendar,
			groups: currentUser.groups,
			profileOptions: currentUser.profileOptions,
		})
	} catch (error) {
		console.error("Error occurred while adding members to group:", error)
		res
			.status(500)
			.json({ error: "Error occurred while adding members to group." })
	}
}

const removeMemberFromGroup = async (req, res) => {
	const { memberEmails = [] } = req.body
	const { groupId } = req.params

	try {
		const currentUser = await User.findById(req.user._id)
		const group = currentUser.groups.id(groupId)

		if (!group) {
			return res.status(404).json({ error: "Group not found." })
		}

		group.members = group.members.filter(
			(email) => !memberEmails.includes(email)
		)
		await currentUser.save()

		for (let email of group.members) {
			const memberUser = await User.findOne({ email })
			if (memberUser) {
				const memberGroup = memberUser.groups.id(groupId)
				if (memberGroup) {
					memberGroup.members = group.members
					await memberUser.save()
				}
			}
		}

		res.status(200).json({
			name: currentUser.name,
			surname: currentUser.surname,
			email: currentUser.email,
			notes: currentUser.notes,
			calendar: currentUser.calendar,
			groups: currentUser.groups,
			profileOptions: currentUser.profileOptions,
		})
	} catch (error) {
		console.error("Error occurred while removing members from group:", error)
		res
			.status(500)
			.json({ error: "Error occurred while removing members from group." })
	}
}

const deleteGroup = async (req, res) => {
	const { groupId } = req.params

	try {
		const currentUser = await User.findById(req.user._id)
		const group = currentUser.groups.id(groupId)

		if (!group) {
			return res.status(404).json({ error: "Group not found." })
		}

		group.remove()
		await currentUser.save()

		for (let email of group.members) {
			const collaboratorUser = await User.findOne({ email })
			if (collaboratorUser) {
				const collaboratorGroup = collaboratorUser.groups.id(groupId)
				if (collaboratorGroup) {
					collaboratorGroup.remove()
					await collaboratorUser.save()
				}
			}
		}

		res.status(200).json({
			name: currentUser.name,
			surname: currentUser.surname,
			email: currentUser.email,
			notes: currentUser.notes,
			calendar: currentUser.calendar,
			groups: currentUser.groups,
			trash: currentUser.trash,
			profileOptions: currentUser.profileOptions,
		})
	} catch (error) {
		console.error("Error occurred while deleting group:", error)
		res.status(500).json({ error: "Error occurred while deleting group." })
	}
}

const addItemToGroup = async (req, res) => {
	const { title, content, category } = req.body
	const addedTime = new Date()
	const groupId = req.params.groupId

	try {
		const currentUser = await User.findById(req.user._id)
		const group = currentUser.groups.id(groupId)

		if (!group) {
			return res.status(404).json({ error: "Group not found." })
		}

		if (!group[category]) {
			group[category] = []
		}

		const newItem = { title, content, addedTime }
		group[category].push(newItem)

		await currentUser.save()

		for (let email of group.members) {
			const memberUser = await User.findOne({ email })
			if (memberUser) {
				const memberGroup = memberUser.groups.id(groupId)
				if (memberGroup) {
					memberGroup[category] = group[category]
					await memberUser.save()
				}
			}
		}

		const addedItem = group[category].find(
			(item) =>
				item.title === title &&
				item.content === content &&
				item.addedTime.getTime() === addedTime.getTime()
		)

		if (!addedItem) {
			return res
				.status(500)
				.json({ error: "Failed to retrieve the added item." })
		}

		res.status(201).json({
			user: {
				name: currentUser.name,
				surname: currentUser.surname,
				email: currentUser.email,
				notes: currentUser.notes,
				calendar: currentUser.calendar,
				groups: currentUser.groups,
				trash: currentUser.trash,
				profileOptions: currentUser.profileOptions,
			},
			newItem: addedItem,
		})
	} catch (error) {
		console.error(`Error occurred while adding ${category} to group:`, error)
		res
			.status(500)
			.json({ error: `Error occurred while adding ${category} to group.` })
	}
}

const editItemInGroup = async (req, res) => {
	const { title, content, category } = req.body
	const groupId = req.params.groupId
	const itemId = req.params.taskId
	console.log(req.params)
	try {
		const currentUser = await User.findById(req.user._id)
		const group = currentUser.groups.id(groupId)

		if (!group) {
			return res.status(404).json({ error: "Group not found." })
		}

		const item = group[category].id(itemId)
		if (!item) {
			return res.status(404).json({
				error: `${
					category.charAt(0).toUpperCase() + category.slice(1)
				} not found.`,
			})
		}

		item.title = title
		item.content = content
		await currentUser.save()

		for (let email of group.members) {
			const memberUser = await User.findOne({ email })
			if (memberUser) {
				const memberGroup = memberUser.groups.id(groupId)
				if (memberGroup) {
					const memberItem = memberGroup[category].id(itemId)
					if (memberItem) {
						memberItem.title = title
						memberItem.content = content
						await memberUser.save()
					}
				}
			}
		}

		res.status(200).json({
			name: currentUser.name,
			surname: currentUser.surname,
			email: currentUser.email,
			notes: currentUser.notes,
			calendar: currentUser.calendar,
			groups: currentUser.groups,
			trash: currentUser.trash,
			profileOptions: currentUser.profileOptions,
		})
	} catch (error) {
		console.error(`Error occurred while editing ${category} in group:`, error)
		res
			.status(500)
			.json({ error: `Error occurred while editing ${category} in group.` })
	}
}

const deleteItemFromGroup = async (req, res) => {
	const { groupId, taskId, category } = req.params

	try {
		const currentUser = await User.findById(req.user._id)
		const group = currentUser.groups.id(groupId)

		if (!group) {
			return res.status(404).json({ error: "Group not found." })
		}

		const item = group[category].id(taskId)
		if (!item) {
			return res.status(404).json({
				error: `${
					category.charAt(0).toUpperCase() + category.slice(1)
				} not found.`,
			})
		}

		item.remove()
		await currentUser.save()

		for (let email of group.members) {
			const memberUser = await User.findOne({ email })
			if (memberUser) {
				const memberGroup = memberUser.groups.id(groupId)
				if (memberGroup) {
					memberGroup[category] = group[category]
					await memberUser.save()
				}
			}
		}

		res.status(200).json({
			name: currentUser.name,
			surname: currentUser.surname,
			email: currentUser.email,
			notes: currentUser.notes,
			calendar: currentUser.calendar,
			groups: currentUser.groups,
			trash: currentUser.trash,
			profileOptions: currentUser.profileOptions,
		})
	} catch (error) {
		console.error(
			`Error occurred while deleting ${category} from group:`,
			error
		)
		res
			.status(500)
			.json({ error: `Error occurred while deleting ${category} from group.` })
	}
}

module.exports = {
	createGroup,
	updateGroupName,
	addMembersToGroup,
	deleteGroup,
	removeMemberFromGroup,
	addItemToGroup,
	editItemInGroup,
	deleteItemFromGroup,
	checkEmailExistence,
}
