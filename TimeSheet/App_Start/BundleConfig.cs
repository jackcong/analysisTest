using System.Web;
using System.Web.Optimization;

namespace TimeSheet
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/logincss").Include("~/Content/Login.css"));

            bundles.Add(new StyleBundle("~/allStyle").Include(
               "~/bower_components/bootstrap/dist/css/bootstrap.css"
                //"~/bower_components/bootstrap/dist/css/bootstrap-theme.css",
                //"~/bower_components/jquery-ui/themes/base/all.css",
                //"~/bower_components/jquery-ui/themes/base/core.css",
                //"~/bower_components/jquery-ui/themes/base/resizable.css",
                //"~/bower_components/jquery-ui/themes/base/selectable.css",
                //"~/bower_components/jquery-ui/themes/base/datepicker.css",
                //"~/bower_components/jquery-ui/themes/base/progressbar.css",
                //"~/bower_components/jquery-ui/themes/base/theme.css",
                //"~/bower_components/angular-loading-bar/src/loading-bar.css",
                //"~/bower_components/angular-dialog-service/dist/dialogs.css",
                //"~/Content/Themes/SbAdmin/css/sb-admin.css",
                //"~/Content/Genghis.css",
                //"~/Content/alerts.css",
                //"~/Content/fineuploader.css",
               // "~/Scripts/Vendor/SbAdmin/plugins/datepicker/bootstrap-datetimepicker.css"
               ));

            bundles.Add(new ScriptBundle("~/SystemScript").Include(
                "~/bower_components/jquery/dist/jquery.js",

                "~/bower_components/bootstrap/dist/js/bootstrap.js",

                "~/bower_components/angular/angular.js"

                ));

            bundles.Add(new ScriptBundle("~/CustomerScript").Include(

                 "~/Scripts/controllers/DashBoardController.js"
  
                ));

            BundleTable.EnableOptimizations = false;
        }
    }
}