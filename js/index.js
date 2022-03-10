var deleteTagBtn = $(".delete-tag");
const jobList = $("#job-section #job-list");
var tagInJobList = $("#job-section #job-list .tag");
var tagInTagSection = $("#tag-section #tag-list .tag");
const tagList = $("#tag-section #tag-list");
const tagSection = $("#tag-section");

var tagNameList = [];

function CheckNumberOfTags() {
    tagInTagSection = $("#tag-section #tag-list .tag");
    if (tagInTagSection.length == 0) {
        tagSection.addClass("none");
    }
    else {
        tagSection.removeClass("none");
    }
}

function ShowJobByTag() {
    for (let i = 0; i < tagInJobList.closest(".job").length; i++) {
        var mark = 0;
        const tagWithJobID = $("#" + (i+1) + " .tag");

        for (let j = 0; j < tagWithJobID.length; j++) {
            console.log(tagNameList);
            if (tagNameList.includes(tagWithJobID.eq(j).text())) {
                mark += 1;
                console.log(tagWithJobID.eq(j).text());
            }
        }

        if (mark == tagInTagSection.length) {
            tagInJobList.closest(".job").eq(i).show();
        }
    }
}

function ClearAllTags() {
    tagInTagSection.closest("li").remove();
    tagNameList = [];
    CheckNumberOfTags();
    ShowJobByTag();
}

CheckNumberOfTags();

$(function() {
    $.getJSON("data.json", function(data) {
        $.each(data.job, function(i, f) {
            var featuredCheck = f.featured ? "<p class='featured'>featured</p>" : "";
            var newCheck = f.new ? "<p class='new'>new!</p>" : "";

            var languages = "";
            var tools = "";

            function GetJobTag(typeInData) {
                var type = "";
                for ( let i = 0; i < typeInData.length; i++) {
                    type += "<li class='tag'>" + typeInData[i] + "</li>"
                }
                return type;
            }

            languages = GetJobTag(f.languages);
            tools = GetJobTag(f.tools);

            var jobHTML = "" +
            "  <img class='logo' src='" + f.logo + "' alt='" + f.company + "'>" +
            "    <div class='job-info'>" +
            "       <div class='company'>" +
            "           <p class='company-name'>" + f.company +"</p>" +
            newCheck + featuredCheck +
            "       </div>" +
            "        <h1 class='position'>" + f.position + "</h1>" +
            "        <p class='other-info'><span class='posted-at'>" + f.postedAt + "</span> ∙ <span class='contract'>" + f.contract + "</span> ∙ <span class='location'>" + f.location + "</span></p>" +
            "    </div>" +
            "    <hr>" +
            "    <ul class='job-tag'>" +
            "        <li class='tag'>" + f.role + "</li>" +
            "        <li class='tag'>" + f.level + "</li>" +
            tools + languages +
            "    </ul>";

            $("<li id='" + f.id + "' class='job'>" + jobHTML + "</li>").appendTo(jobList);

            tagInJobList = $("#job-section #job-list .tag");
            tagInJobList.click(function() {
                var tagInTagSectionHTML = "" +
                "<div class='tag'>" +
                $(this).text() +
                "  <button class='delete-tag' type='button' aria-label='Delete this tag'></button>" +
                "</div>";
            
                if (tagNameList.includes($(this).text()) == false) {
                    tagNameList.push($(this).text());   
                    $("<li>" + tagInTagSectionHTML + "</li>").appendTo(tagList);
                }

                CheckNumberOfTags();

                // Delete tag buttons
                deleteTagBtn = $(".delete-tag");
                deleteTagBtn.click(function() {
                    const tagName = $(this).closest("div").text().slice(0, $(this).closest("div").text().length - 2);

                    $(this).closest("li").remove();
                    delete tagNameList[tagNameList.indexOf(tagName)];

                    CheckNumberOfTags();
                    ShowJobByTag();
                });

                tagInJobList.closest(".job").hide();
                ShowJobByTag();
            });
        });
    });
})