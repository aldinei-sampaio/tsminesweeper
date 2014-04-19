using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web;

namespace Minesweeper
{
    public static class VersionHelper
    {
        private static string _full;
        private static string _mini;

        public static string GetFull()
        {
            if (_full == null)
            {
                var name = Assembly.GetExecutingAssembly().GetName();
                _full = String.Format("{0:00}.{1:00}.{2:0000}.{3:0000000}", name.Version.Major, name.Version.Minor, name.Version.Build, name.Version.Revision);
            }
            return _full;
        }

        public static string GetMini()
        {
            if (_mini == null)
            {
                var name = Assembly.GetExecutingAssembly().GetName();
                _mini = String.Format("{0}.{1}.{2}.{3}", name.Version.Major, name.Version.Minor, name.Version.Build, name.Version.Revision);
            }
            return _mini;
        }
    }
}