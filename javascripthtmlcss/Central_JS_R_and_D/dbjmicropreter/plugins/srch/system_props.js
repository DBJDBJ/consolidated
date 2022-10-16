(function(global, undefined) {
    /* 
    System search/shell properties from:
    http://msdn.microsoft.com/en-us/library/ff518152%28v=VS.85%29.aspx
    Build date: 3/12/2010 
    */
    var System = [
    "AcquisitionID", "ApplicationName", "Author",
    "Capacity", "Category", "Comment", "Company", "ComputerName", "ContainedItems", "ContentStatus", "ContentType", "Copyright",
    "DateAccessed", "DateAcquired", "DateArchived", "DateCompleted", "DateCreated", "DateImported", "DateModified", "DueDate",
    "EndDate",
    "FileAllocationSize", "FileAttributes", "FileCount", "FileDescription", "FileExtension", "FileFRN", "FileName", "FileOwner", "FileVersion", "FindData", "FlagColor", "FlagColorText", "FlagStatus", "FlagStatusText", "FreeSpace", "FullText",
    "Identity", "Identity.Blob", "Identity.DisplayName", "Identity.IsMeIdentity", "Identity.PrimaryEmailAddress", "Identity.ProviderID", "Identity.UniqueID", "Identity.UserName", "IdentityProvider.Name", "IdentityProvider.Picture",
    "ImageParsingName",
    "Importance", "ImportanceText",
    "IsAttachment",
    "IsDefaultNonOwnerSaveLocation", "IsDefaultSaveLocation",
    "IsDeleted", "IsEncrypted",
    "IsFlagged", "IsFlaggedComplete",
    "IsIncomplete",
    "IsLocationSupported",
    "IsPinnedToNameSpaceTree",
    "IsRead",
    "IsSearchOnlyItem",
    "IsSendToTarget",
    "IsShared",
    "ItemAuthors",
    "ItemClassType",
    "ItemDate",
    "ItemFolderNameDisplay",
    "ItemFolderPathDisplay",
    "ItemFolderPathDisplayNarrow",
    "ItemName",
    "ItemNameDisplay",
    "ItemNamePrefix",
    "ItemParticipants",
    "ItemPathDisplay",
    "ItemPathDisplayNarrow",
    "ItemType",
    "ItemTypeText",
    "ItemUrl",
    "Keywords",
    "Kind",
    "KindText",
    "Language",
    "LayoutPattern.ContentViewModeForBrowse",
    "LayoutPattern.ContentViewModeForSearch",
    "MileageInformation",
    "MIMEType",
    "Null",
    "OfflineAvailability", "OfflineStatus",
    "OriginalFileName",
    "OwnerSID",
    "ParentalRating", "ParentalRatingReason", "ParentalRatingsOrganization",
    "ParsingBindContext", "ParsingName", "ParsingPath",
    "PerceivedType",
    "PercentFull",
    "Priority", "PriorityText",
    "Project",
    "ProviderItemID",
    "Rating", "RatingText",
    "Sensitivity", "SensitivityText",
    "SFGAOFlags",
    "SharedWith", "ShareUserRating", "SharingStatus",
    "Shell.OmitFromView",
    "SimpleRating",
    "Size",
    "SoftwareUsed",
    "SourceItem",
    "StartDate",
    "Status",
    "Subject",
    "Thumbnail", "ThumbnailCacheId", "ThumbnailStream",
    "Title",
    "TotalFileSize",
    "Trademarks"
    ];
    
    global.system_property = function ( idx ) {
        return "System." + System[0+idx] ;
    }

} (this));
/*
TypeError 
Number : 5007
Description : Unable to get value of the property 'safari': object is null or undefined
*/