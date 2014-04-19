<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="Minesweeper._default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <title>Campo Minado em Typescript</title>
    <link rel="stylesheet" href="Content/themes/base/minified/jquery-ui.min.css" type="text/css" />
    <script src="Scripts/jquery-2.1.0.min.js"></script>
    <script src="Scripts/jquery-ui-1.10.4.min.js"></script>
    <script src="app.full.js?<%= Minesweeper.VersionHelper.GetFull() %>"></script>
    <style type="text/css">
        body {
            font-family: 'Segoe UI', sans-serif;
            font-size: 10pt;
        }

        h1 {
            margin:0;
        }

        p {
            margin-top: 0px;
            margin-left: 0px;
            margin-bottom: 10px;
            margin-right: 0px;
        }

        img {
            vertical-align: middle;
        }

        td {
            text-align: center;
            vertical-align: middle;
            padding: 0;
            margin: 0;
        }

        .mainTable {
            min-width: 200px;
            border-bottom: 1px solid #C0C0C0;
        }

        .mainTable td {
            border-left: 1px solid #C0C0C0;
            border-right: 1px solid #C0C0C0;
            border-top: 1px solid #C0C0C0;
        }

        .mainTable td table td {
            border: none;
            padding: 0;
        }

        .fieldTable {
            border-bottom: 1px solid #E0E0E0;
            border-right: 1px solid #E0E0E0;
            margin-left: auto;
            margin-right: auto;
        }


        .fieldCell {
            width: 20px;
            height: 20px;
            font-size: 10pt;
            font-weight: bold;
            border-top: 1px solid #E0E0E0;
            border-left: 1px solid #E0E0E0;
            border-bottom: none;
            border-right: none;
            text-align: center;
            vertical-align: middle;
            padding: 1px;
        }

        .fieldCell a { 
            display: block; 
            width: 20px; 
            height: 20px; 
            text-decoration: none;
            background: url(Images/NormalButtonReady.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .fieldCell a:hover {
            background: url(Images/NormalButtonHover.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .fieldCell a:active {
            background: url(Images/NormalButtonPressed.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .fieldCell a[disabled=disabled] {
            background: url(Images/NormalButtonDisabled.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .tip_safe {
            background: url(Images/TipGreen.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top;
        }

        .tip_safe a {
            background: url(Images/TipButtonReady.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .tip_safe a:hover {
            background: url(Images/TipButtonHover.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .tip_safe a:active {
            background: url(Images/TipButtonPressed.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .tip_safe a[disabled=disabled] {
            background: url(Images/TipButtonDisabled.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .tip_mine {
            background: url(Images/TipRed.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top;
        }

        .tip_mine a {
            background: url(Images/TipRedButtonReady.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .tip_mine a:hover {
            background: url(Images/TipRedButtonHover.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .tip_mine a:active {
            background: url(Images/TipRedButtonPressed.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .tip_mine a[disabled=disabled] {
            background: url(Images/TipRedButtonDisabled.png?<%= Minesweeper.VersionHelper.GetFull() %>) no-repeat top; 
        }

        .exploded div {
            background: none;
            background-color: red;
        }
        
        .headerPanel {
            text-align: center;
            background-color: #D0D0D0;
            padding: 3px;
        }

        .flagDisplay {
            width: 56px;
            height: 24px;
            background: black;
            padding: 2px;
        }

        .flagDisplay img {
            margin: 1px;
        }

        .clockDisplay {
            width: 68px;
            height: 24px;
            background: black;
            padding: 2px;
        }

        .clockDisplay img {
            margin: 1px;
        }

        .resetPanel {
            height: 25px;
            text-align: center;
            vertical-align: middle;
        }

        .optionsPanel {
            padding: 5px;
            background: #D0D0D0;
            width: 350px;
            height: 180px;
            border: 1px solid black;
            font-size: 9pt;
        }

        .optionsPanel table {
            margin-bottom: 10px;
        }

        .optionsPanel td {
            width:200px;
        }

        .optionsPanel input[type=text] {
            width: 25px;    
        }

        .optionsPanel p {
            margin: 0;
            padding: 0;
        }

        .invalid {
            background-color:#fb8d8d;
        }

        .footerPanel {
            background-color:#D0D0D0;
            padding: 3px;
        }

        .tipMessage {
            font-size: 8pt;
            color: darkred;
            padding: 3px;
        }
    </style>

    <script type="text/javascript">
        $(function () {
            App.version = '<%= Minesweeper.VersionHelper.GetFull() %>';
            $(document).bind("contextmenu", function (e) { e.preventDefault() });
            $('#version').text('Versão <%= Minesweeper.VersionHelper.GetMini() %>');
            App.start($('#content'));
        });
    </script>
</head>
<body>
    <h1>Campo Minado em Typescript</h1>
    <p id="version"></p>
    <div id="content"></div>
</body>
</html>