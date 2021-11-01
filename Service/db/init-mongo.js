db.createUser(
    {
        user: "CarterMacLennan",
        pwd: "doesntMatterWhatThisIs",
        roles: [
            {
                role: "readWrite",
                db: "Dev"
            }
        ]
    }
)